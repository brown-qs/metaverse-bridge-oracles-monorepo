import { init, IEncryptedMessage, Utils, MessageBodyType, Message, ICredential, Did, Credential, DidUri, connect, DidResourceUri, CType, Claim, RequestForAttestation, Attestation, KeyringPair } from '@kiltprotocol/sdk-js';
import { GoneException, Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { blake2AsU8a, cryptoWaitReady, keyExtractPath, keyFromPath, mnemonicToMiniSecret, naclBoxPairFromSecret, naclOpen, naclSeal, randomAsHex, sr25519PairFromSeed } from '@polkadot/util-crypto';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { WalletLoginMessage } from './dtos';
import { UserService } from 'src/user/user/user.service';
import { UserEntity } from 'src/user/user/user.entity';
import { KiltSessionEntity } from 'src/user/kilt-session/kilt-session.entity';
import { KiltSessionService } from 'src/user/kilt-session/kilt-session.service';


@Injectable()
export class KiltAuthService {
    private readonly context: string;
    private encryptionKeyStore: {
        encrypt({ data, alg, peerPublicKey }: any): Promise<{
            data: Uint8Array;
            alg: any;
            nonce: Uint8Array;
        }>, decrypt({ data, alg, nonce, peerPublicKey }: any): Promise<{
            data: Uint8Array;
            alg: any;
        }>
    };
    initKiltPromise: Promise<void>;

    constructor(
        private kiltSessionService: KiltSessionService,
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthService.name;
        this.initKiltPromise = this.initKilt()
    }

    private async initKilt() {
        await cryptoWaitReady()
        await init({ address: this.configService.get<string>('kilt.wssAddress') })
        await connect()
    }


    //calling this.keypairs() doesn't work but calling the exact same function defined outside the class works ???
    private async keypairs() {
        await cryptoWaitReady()
        const signingKeyPairType = 'sr25519'
        const keyring = new Utils.Keyring({
            ss58Format: 38,
            type: signingKeyPairType,
        })
        const account = keyring.addFromMnemonic(process.env.KILT_VERIFIER_MNEMONIC)
        const keypairs = {
            authentication: account.derive('//did//0'),
            assertion: account.derive('//did//assertion//0'),
            keyAgreement: (function () {
                const secretKeyPair = sr25519PairFromSeed(mnemonicToMiniSecret(process.env.KILT_VERIFIER_MNEMONIC))
                const { path } = keyExtractPath('//did//keyAgreement//0')
                const { secretKey } = keyFromPath(secretKeyPair, path, 'sr25519')
                const blake = blake2AsU8a(secretKey)
                const boxPair = naclBoxPairFromSecret(blake)
                return {
                    ...boxPair,
                    type: 'x25519',
                }
            })(),
        }
        return keypairs
    }

    private async getEncrpytionKeyStore() {
        if (!this.encryptionKeyStore) {
            this.encryptionKeyStore = {
                async encrypt({ data, alg, peerPublicKey }: any) {
                    const keypair = await keypairs()
                    const { sealed, nonce } = naclSeal(
                        data,
                        keypair.keyAgreement.secretKey,
                        peerPublicKey
                    )
                    return { data: sealed, alg, nonce }
                },
                async decrypt({ data, alg, nonce, peerPublicKey }: any) {
                    const keypair = await keypairs()

                    const decrypted = naclOpen(
                        data,
                        nonce,
                        peerPublicKey,
                        keypair.keyAgreement.secretKey
                    )
                    if (!decrypted) throw new Error('Failed to decrypt with given key')
                    return { data: decrypted, alg }
                },
            }
        }

        return this.encryptionKeyStore
    }

    private async decryptChallenge(
        encryptedChallenge: string,
        encryptionKey: { publicKey: Uint8Array },
        nonce: string
    ) {
        // decrypt the challenge
        const data = Utils.Crypto.coToUInt8(encryptedChallenge)
        const nonced = Utils.Crypto.coToUInt8(nonce)

        const peerPublicKey = encryptionKey.publicKey

        const keypair = await keypairs()
        const decrypted = naclOpen(
            data,
            nonced,
            peerPublicKey,
            keypair.keyAgreement.secretKey
        )
        // compare hex strings, fail if mismatch
        return Utils.Crypto.u8aToHex(decrypted)
    }

    private async getFullDid() {
        //TODO: don't cast as DidUri, do proper checks to make sure it is a the valid string format
        const fullDid = await Did.FullDidDetails.fromChainInfo(process.env.KILT_VERIFIER_DID_URI as DidUri)
        return fullDid
    }


    private async getEncryptionKey(encryptionKeyId: DidResourceUri) {
        await this.initKiltPromise
        const encryptionKey = await Did.DidResolver.resolveKey(encryptionKeyId);
        return encryptionKey
    }


    async getWalletSessionChallenge(): Promise<KiltSessionEntity> {
        await this.initKiltPromise
        await cryptoWaitReady()
        await init({ address: this.configService.get<string>('kilt.wssAddress') })
        // create session data
        const fullDid = await this.getFullDid()

        const dAppEncryptionKeyUri = fullDid.assembleKeyUri(fullDid.encryptionKey.id);


        return await this.kiltSessionService.create(randomAsHex(), randomAsHex(), this.configService.get<string>('kilt.dappName'), dAppEncryptionKeyUri)
    }


    async verifyWalletSessionChallenge(encryptionKeyUri: DidResourceUri, encryptedWalletSessionChallenge: string, nonce: string, sessionId: string) {
        await this.initKiltPromise


        const session = await this.kiltSessionService.findBySessionId(sessionId)
        if (!session) {
            this.logger.error(`kiltAuthVerifyChallenge:: sessionId: ${sessionId} not found`, null, this.context)
            throw new GoneException("session gone")
        }

        // load the encryption key
        let encryptionKey
        try {
            encryptionKey = await this.getEncryptionKey(encryptionKeyUri)

        } catch (err) {
            this.logger.error(`kiltAuthVerifyChallenge:: failed resolving ${encryptionKeyUri}`, err, this.context)
            throw new UnprocessableEntityException
        }


        // decrypt the message
        const decrypted = await this.decryptChallenge(encryptedWalletSessionChallenge, encryptionKey, nonce);
        if (decrypted !== session.walletSessionChallenge) {
            this.logger.error(`kiltAuthVerifyChallenge:: challenge mismatch`, null, this.context)
            throw new UnprocessableEntityException
        }

        await this.kiltSessionService.update({ sessionId }, { encryptedDid: encryptionKey.controller, encryptionKeyUri, didConfirmed: true, updatedAt: new Date() })
    }

    async getWalletLoginChallenge(sessionId: string): Promise<IEncryptedMessage> {
        await this.initKiltPromise

        const session = await this.kiltSessionService.findBySessionId(sessionId)
        if (!session) {
            this.logger.error(`walletCredentialMessage:: sessionId: ${sessionId} not found`, null, this.context)
            throw new GoneException("session gone")
        }

        // load encryptionKeyId and the did, making sure it's confirmed
        const { encryptedDid, didConfirmed, encryptionKeyUri } = session;
        if (!encryptedDid || !didConfirmed) {
            this.logger.error(`walletCredentialMessage:: unconfirmed did`, null, this.context)
            throw new UnprocessableEntityException
        }
        if (!encryptionKeyUri) {
            this.logger.error(`walletCredentialMessage:: missing encryptionKeyUri`, null, this.context)
            throw new UnprocessableEntityException
        }


        // set the challenge
        const walletLoginChallenge = Utils.UUID.generate();
        //TODO: i
        await this.kiltSessionService.update({ sessionId }, { walletLoginChallenge, updatedAt: new Date() })

        // construct the message
        const cType = {
            name: this.configService.get<string>('kilt.cTypeName'),
            cTypeHash: this.configService.get<string>('kilt.cTypeHash')
        }
        const cTypes = [cType]
        const content = { cTypes, challenge: walletLoginChallenge } as any;
        const type = MessageBodyType.REQUEST_CREDENTIAL;
        const didUri = this.configService.get<DidUri>('kilt.verifierDidUri');
        const keyDid = encryptionKeyUri.replace(/#.*$/, '') as DidUri;
        const message = new Message({ content, type }, didUri, keyDid);
        if (!message) {
            this.logger.error(`walletCredentialMessage:: failed to construct message`, null, this.context)
            throw new UnprocessableEntityException
        }
        const fullDid = await this.getFullDid();
        const encryptionKeyStore = await this.getEncrpytionKeyStore()
        // encrypt the message
        let output
        try {
            output = await message.encrypt(fullDid.encryptionKey.id, fullDid, encryptionKeyStore, encryptionKeyUri);

        } catch (e) {
            this.logger.error(`walletCredentialMessage:: unable to encrypt challege`, null, this.context)
            throw new UnprocessableEntityException

        }


        if (!output) {
            this.logger.error(`walletCredentialMessage:: failed to encrypt message`, null, this.context)

            throw new UnprocessableEntityException
        }

        return output
    }
    async verifyWalletLoginChallenge(sessionId: string, rawMessage: WalletLoginMessage): Promise<UserEntity> {
        await this.initKiltPromise

        const session = await this.kiltSessionService.findBySessionId(sessionId)
        if (!session) {
            this.logger.error(`verifyWalletLoginChallenge:: sessionId: ${sessionId} not found`, null, this.context)
            throw new GoneException("session gone")
        }


        const walletLoginChallenge = session.walletLoginChallenge
        if (!walletLoginChallenge) {
            this.logger.error(`verifyWalletLoginChallenge:: invalid loginChallenge request`, null, this.context)
            throw new UnprocessableEntityException
        }

        // get decrypted message
        const fullDid = await this.getFullDid();
        const encryptionKeyStore = await this.getEncrpytionKeyStore()
        const message = await Message.decrypt(rawMessage, encryptionKeyStore, fullDid);
        const messageBody = message.body;
        const type = messageBody.type
        const content = messageBody.content as ICredential[]
        // fail if incorrect message type
        if (type !== 'submit-credential') {
            this.logger.error(`verifyWalletLoginChallenge:: unexpected message type`, null, this.context)
            throw new UnprocessableEntityException
        }

        // load the credential, check attestation and ownership
        const credential = Credential.fromCredential(content[0]);

        const isValid = await credential.verify({ challenge: walletLoginChallenge });
        if (!isValid) {
            this.logger.error(`verifyWalletLoginChallenge:: invalid credential`, null, this.context)
            throw new UnprocessableEntityException
        }

        const { owner } = credential.request.claim
        //TODO: use kilt sdk parse this out
        //
        const did = owner.includes(':light:') ? `did:kilt:${owner.split(':')[3]}` : owner
        if (credential.request.claim.cTypeHash !== this.configService.get<string>('kilt.cTypeHash')) {
            this.logger.error(`cTypeHash mismatch, probably will never happen`, null, this.context)
            throw new UnprocessableEntityException
        }

        const email = credential.request.claim.contents.Email
        if (!email || typeof email !== "string") {
            this.logger.error(`User didn't share email`, null, this.context)
            throw new UnprocessableEntityException("User didn't share email")
        }


        await this.kiltSessionService.update({ sessionId }, { verified: true, did, updatedAt: new Date() })

        this.logger.debug(`"successfully logged in kilt as: ${email}`, this.context)

        const user = await this.userService.createEmail(email.toLowerCase().trim())
        await this.kiltSessionService.update({ sessionId }, { user, email: email.toLowerCase().trim(), updatedAt: new Date() })
        return user
    }

    async didConfiguration() {
        await this.initKiltPromise
        let port = `:${this.configService.get<string>('server.port')}`;
        if (port === "80") {
            port = ""
        }
        const host = this.configService.get<string>('server.host');
        const scheme = this.configService.get<string>('server.scheme');

        const origin = `${scheme}://${host}${port}`
        const claimContents = {
            id: this.configService.get<DidUri>('kilt.verifierDidUri'),
            origin: origin,
        };

        const domainLinkageCType = CType.fromCType({
            schema: {
                $schema: 'http://kilt-protocol.org/draft-01/ctype#',
                title: 'Domain Linkage Credential',
                properties: {
                    id: {
                        type: 'string',
                    },
                    origin: {
                        type: 'string',
                    },
                },
                type: 'object',
                $id: 'kilt:ctype:0x9d271c790775ee831352291f01c5d04c7979713a5896dcf5e81708184cc5c643',
            },
            owner: null,
            hash: '0x9d271c790775ee831352291f01c5d04c7979713a5896dcf5e81708184cc5c643',
        });

        const claim = Claim.fromCTypeAndClaimContents(
            domainLinkageCType,
            claimContents,
            this.configService.get<DidUri>('kilt.verifierDidUri'),
        );

        const requestForAttestation = RequestForAttestation.fromClaim(claim);

        const fullDid = await this.getFullDid()
        const attestationKey = fullDid.attestationKey;
        if (!attestationKey) {
            throw new Error('The attestation key is not defined?!?');
        }

        const kpairs: any = await keypairs()
        const { signature, keyUri } = await fullDid.signPayload(
            Utils.Crypto.coToUInt8(requestForAttestation.rootHash),
            kpairs,
            attestationKey.id
        );

        const selfSignedRequest = await requestForAttestation.addSignature(
            signature,
            keyUri,
        );

        const attestation = Attestation.fromRequestAndDid(
            selfSignedRequest,
            this.configService.get<DidUri>('kilt.verifierDidUri'),
        );

        const domainLinkageCredential = Credential.fromRequestAndAttestation(selfSignedRequest, attestation);

        return {
            '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
            linked_dids: [domainLinkageCredential],
        }
    }
}

async function keypairs() {
    await cryptoWaitReady()
    const signingKeyPairType = 'sr25519'
    const keyring = new Utils.Keyring({
        ss58Format: 38,
        type: signingKeyPairType,
    })
    const account = keyring.addFromMnemonic(process.env.KILT_VERIFIER_MNEMONIC)
    const keypairs = {
        authentication: account.derive('//did//0'),
        assertion: account.derive('//did//assertion//0'),
        keyAgreement: (function () {
            const secretKeyPair = sr25519PairFromSeed(mnemonicToMiniSecret(process.env.KILT_VERIFIER_MNEMONIC))
            const { path } = keyExtractPath('//did//keyAgreement//0')
            const { secretKey } = keyFromPath(secretKeyPair, path, 'sr25519')
            const blake = blake2AsU8a(secretKey)
            const boxPair = naclBoxPairFromSecret(blake)
            return {
                ...boxPair,
                type: 'x25519',
            }
        })(),
    }
    return keypairs
}

