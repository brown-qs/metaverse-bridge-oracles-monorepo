import { BlockchainUtils, VerificationKeyType, init, IEncryptedMessage, Utils, MessageBodyType, Message, ICredential, Did, Credential, DidUri, connect, DidResourceUri, CType, Claim, RequestForAttestation, Attestation, KeyringPair, KeystoreSigner, DidSignature, IClaimContents } from '@kiltprotocol/sdk-js';
import { GoneException, Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { blake2AsHex, blake2AsU8a, cryptoWaitReady, keyExtractPath, keyFromPath, mnemonicToMiniSecret, naclBoxPairFromSecret, naclOpen, naclSeal, randomAsHex, sr25519PairFromSeed } from '@polkadot/util-crypto';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { WalletLoginMessage } from './dtos';
import { UserService } from 'src/user/user/user.service';
import { UserEntity } from 'src/user/user/user.entity';
import { KiltSessionEntity } from 'src/user/kilt-session/kilt-session.entity';
import { KiltSessionService } from 'src/user/kilt-session/kilt-session.service';
import { ApiPromise, WsProvider } from '@polkadot/api'

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

    /*
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
    }*/

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

        const origin = this.configService.get<string>('frontend.url');
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

        const { signature, keyUri } = await fullDid.signPayload(
            Utils.Crypto.coToUInt8(requestForAttestation.rootHash),
            assertionKeystore,
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

        const credential = Credential.fromRequestAndAttestation(selfSignedRequest, attestation);
        const domainLinkageCredential = fromCredential(credential);
        const result = {
            '@context': 'https://identity.foundation/.well-known/did-configuration/v1',
            linked_dids: [domainLinkageCredential],
        }

        console.log("=========== did-configuration.json ===========")
        console.log(JSON.stringify(result, null, 4))
        console.log("----------------------------------------------")
        //make sure it verifies
        const outputDid = result.linked_dids[0].issuer
        const outputSignature = result.linked_dids[0].proof.signature
        const outputRootHash = result.linked_dids[0].credentialSubject.rootHash
        console.log(`outputDid: ${outputDid} outputSignature: ${outputSignature} outputRootHash: ${outputRootHash}`)
        const issuerDidDetails = await Did.FullDidDetails.fromChainInfo(outputDid as DidUri);
        if (!issuerDidDetails) {
            throw new Error(`Cannot resolve DID ${outputDid}`);
        }
        const { verified } = await Did.verifyDidSignature({
            signature: {
                keyUri: issuerDidDetails.assembleKeyUri(
                    issuerDidDetails.attestationKey.id,
                ),
                signature: outputSignature as string,
            },
            message: Utils.Crypto.coToUInt8(outputRootHash),
        });

        if (!verified) {
            throw new UnprocessableEntityException("did-configuration.json failed to pass verification")
        }

        return result
    }

    //only run this once for a DID to add an attestation key
    async addAttestationKey() {
        console.log("addAttestationKey()")
        await this.initKiltPromise
        const keyring = new Utils.Keyring({
            ss58Format: 38,
            type: "sr25519",
        })
        const account = keyring.addFromMnemonic(process.env.KILT_VERIFIER_MNEMONIC)

        const keystore = new Did.DemoKeystore()
        const authenticationKey = await keystore.generateKeypair({ alg: Did.SigningAlgorithms.Sr25519, seed: `${process.env.KILT_VERIFIER_MNEMONIC}//did//0` })
        const keyAgreementKey = await keystore.generateKeypair({ alg: Did.EncryptionAlgorithms.NaclBox, seed: `${process.env.KILT_VERIFIER_MNEMONIC}//did//keyAgreement//0` })


        const provider = new WsProvider('wss://spiritnet.kilt.io');

        // Create the API and wait until ready
        const apiPromise = await ApiPromise.create({ provider });

        const fullDid = await this.getFullDid()

        // Retrieve the chain & node information information via rpc calls
        const [chain, nodeName, nodeVersion] = await Promise.all([
            apiPromise.rpc.system.chain(),
            apiPromise.rpc.system.name(),
            apiPromise.rpc.system.version()
        ]);

        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
        const attestationKeyPublicDetails = await keystore.generateKeypair({
            seed: `${process.env.KILT_VERIFIER_MNEMONIC}//did//att//0`,
            alg: Did.SigningAlgorithms.Sr25519
        })

        //submitterAccount is then the keypair generated from the mnemonic with no derivation path
        console.log(`account.address: ${account.address}`)


        const didUpdate = await new Did.FullDidUpdateBuilder(apiPromise, fullDid).setAttestationKey({
            publicKey: attestationKeyPublicDetails.publicKey,
            type: VerificationKeyType.Sr25519
        }).build(keystore, account.address)
        await BlockchainUtils.signAndSubmitTx(didUpdate, account)
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

const assertionKeystore: KeystoreSigner = {
    async sign({ data, alg }) {
        const { assertion } = await keypairs();

        return {
            data: assertion.sign(data, { withType: false }),
            alg,
        };
    },
};

const DEFAULT_VERIFIABLECREDENTIAL_CONTEXT =
    'https://www.w3.org/2018/credentials/v1';
const DEFAULT_VERIFIABLECREDENTIAL_TYPE = 'VerifiableCredential';
const KILT_VERIFIABLECREDENTIAL_TYPE = 'KiltCredential2020';
const KILT_SELF_SIGNED_PROOF_TYPE = 'KILTSelfSigned2020';

// taken from https://github.com/KILTprotocol/sdk-js/blob/develop/packages/vc-export/src/exportToVerifiableCredential.ts

const context = [
    DEFAULT_VERIFIABLECREDENTIAL_CONTEXT,
    'https://identity.foundation/.well-known/did-configuration/v1',
];


export function fromCredential(input: ICredential): any {
    const credentialSubject = {
        ...input.request.claim.contents,
        rootHash: input.request.rootHash,
    };
    const issuer = input.attestation.owner;

    // add current date bc we have no issuance date on credential
    // TODO: could we get this from block time or something?
    const issuanceDate = new Date().toISOString();
    const expirationDate = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 365 * 5,
    ).toISOString(); // 5 years

    const claimerSignature = input.request.claimerSignature as DidSignature & {
        challenge: string;
    };

    // add self-signed proof
    const proof = {
        type: KILT_SELF_SIGNED_PROOF_TYPE,
        proofPurpose: 'assertionMethod',
        verificationMethod: claimerSignature.keyUri,
        signature: claimerSignature.signature,
        challenge: claimerSignature.challenge,
    };

    return {
        '@context': context,
        issuer,
        issuanceDate,
        expirationDate,
        type: [
            DEFAULT_VERIFIABLECREDENTIAL_TYPE,
            'DomainLinkageCredential',
            KILT_VERIFIABLECREDENTIAL_TYPE,
        ],
        credentialSubject,
        proof,
    };
}