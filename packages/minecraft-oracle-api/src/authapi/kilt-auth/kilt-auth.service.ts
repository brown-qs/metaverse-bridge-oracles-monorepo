import { init, IEncryptedMessage, Utils, MessageBodyType, Message, ICredential, Did, Credential } from '@kiltprotocol/sdk-js';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { cryptoWaitReady, randomAsHex } from '@polkadot/util-crypto';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { getFullDid, decryptChallenge, encryptionKeystore } from 'src/kilt/verifier';
import { KiltUserService } from 'src/user/kilt-user/kilt-user.service';
import { WalletLoginMessage } from './dtos';
export interface KiltSession {
    sessionId: string,
    walletSessionChallenge: string,
    dappName: string,
    dAppEncryptionKeyId: string,
    walletLoginChallenge?: string,
    did?: string,
    didConfirmed?: boolean,
    encryptionKeyId?: string,
    verified?: boolean
}
@Injectable()
export class KiltAuthService {
    private readonly context: string;
    private readonly kiltSessions: KiltSession[] = []

    constructor(
        private userService: KiltUserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthService.name;
    }

    async getWalletSessionChallenge(): Promise<KiltSession> {
        await cryptoWaitReady()
        await init({ address: process.env.KILT_WSS_ADDRESS })
        // create session data
        const fullDid = await getFullDid()

        const dAppEncryptionKeyId = fullDid.assembleKeyId(fullDid.encryptionKey.id);

        const kiltSession = {
            sessionId: randomAsHex(),
            walletSessionChallenge: randomAsHex(),
            dappName: process.env.KILT_DAPP_NAME,
            dAppEncryptionKeyId,
        }
        this.kiltSessions.push(kiltSession)
        return { ...kiltSession }
    }


    async verifyWalletSessionChallenge(encryptionKeyId: string, encryptedWalletSessionChallenge: string, nonce: string, sessionId: string) {

        const session = this.kiltSessions.find(sess => sess.sessionId === sessionId)
        if (!session) {
            this.logger.error(`kiltAuthVerifyChallenge:: sessionId: ${sessionId} not found`, null, this.context)
            throw new UnauthorizedException
        }

        // load the encryption key
        const encryptionKey = await getEncryptionKey(encryptionKeyId)
        if (!session) {
            this.logger.error(`kiltAuthVerifyChallenge:: failed resolving ${encryptionKeyId}`, null, this.context)
            throw new UnauthorizedException
        }

        // decrypt the message
        const decrypted = await decryptChallenge(encryptedWalletSessionChallenge, encryptionKey, nonce);
        if (decrypted !== session.walletSessionChallenge) {
            this.logger.error(`kiltAuthVerifyChallenge:: challenge mismatch`, null, this.context)
            throw new UnauthorizedException
        }
        session.did = encryptionKey.controller
        session.encryptionKeyId = encryptionKeyId
        session.didConfirmed = true
    }

    async getWalletLoginChallenge(sessionId: string): Promise<IEncryptedMessage> {
        const session = this.kiltSessions.find(sess => sess.sessionId === sessionId)
        if (!session) {
            this.logger.error(`walletCredentialMessage:: sessionId: ${sessionId} not found`, null, this.context)
            throw new UnauthorizedException
        }

        // load encryptionKeyId and the did, making sure it's confirmed
        const { did, didConfirmed, encryptionKeyId } = session;
        if (!did || !didConfirmed) {
            this.logger.error(`walletCredentialMessage:: unconfirmed did`, null, this.context)
            throw new UnauthorizedException
        }
        if (!encryptionKeyId) {
            this.logger.error(`walletCredentialMessage:: missing encryptionKeyId`, null, this.context)
            throw new UnauthorizedException
        }


        // set the challenge
        const walletLoginChallenge = Utils.UUID.generate();
        //TODO: i
        session.walletLoginChallenge = walletLoginChallenge

        // construct the message
        const content = { cTypes, challenge: walletLoginChallenge };
        const type = MessageBodyType.REQUEST_CREDENTIAL;
        const didUri = process.env.KILT_VERIFIER_DID_URI;
        const keyDid = encryptionKeyId.replace(/#.*$/, '');
        const message = new Message({ content, type }, didUri, keyDid);
        if (!message) {
            this.logger.error(`walletCredentialMessage:: failed to construct message`, null, this.context)
            throw new UnauthorizedException
        }
        const fullDid = await getFullDid();
        // encrypt the message
        let output
        try {
            output = await message.encrypt(fullDid.encryptionKey.id, fullDid, encryptionKeystore, encryptionKeyId);

        } catch (e) {
            this.logger.error(`walletCredentialMessage:: unable to encrypt challege`, null, this.context)
            throw new UnauthorizedException

        }


        if (!output) {
            this.logger.error(`walletCredentialMessage:: failed to encrypt message`, null, this.context)

            throw new UnauthorizedException
        }

        return output
    }
    async verifyWalletLoginChallenge(sessionId: string, rawMessage: WalletLoginMessage) {

        const session = this.kiltSessions.find(sess => sess.sessionId === sessionId)
        if (!session) {
            this.logger.error(`verifyWalletLoginChallenge:: sessionId: ${sessionId} not found`, null, this.context)
            throw new UnauthorizedException
        }


        const walletLoginChallenge = session.walletLoginChallenge
        if (!walletLoginChallenge) {
            this.logger.error(`verifyWalletLoginChallenge:: invalid loginChallenge request`, null, this.context)
            throw new UnauthorizedException
        }

        // get decrypted message
        const fullDid = await getFullDid();
        const message = await Message.decrypt(rawMessage, encryptionKeystore, fullDid);
        const messageBody = message.body;
        const type = messageBody.type
        const content = messageBody.content as ICredential[]

        // fail if incorrect message type
        if (type !== 'submit-credential') {
            this.logger.error(`verifyWalletLoginChallenge:: unexpected message type`, null, this.context)
            throw new UnauthorizedException
        }

        // load the credential, check attestation and ownership
        const credential = Credential.fromCredential(content[0]);
        const isValid = await credential.verify({ challenge: walletLoginChallenge });
        const { owner } = credential.request.claim
        const did = owner.includes(':light:') ? `did:kilt:${owner.split(':')[3]}` : owner

        if (!isValid) {
            this.logger.error(`verifyWalletLoginChallenge:: invalid credential`, null, this.context)
            throw new UnauthorizedException
        }
        session.verified = true
        console.log("successfully logged in")
        //TODO: mark session as verified: true
    }
}

async function getEncryptionKey(encryptionKeyId: string) {
    await cryptoWaitReady();
    await init({ address: process.env.KILT_WSS_ADDRESS });
    const encryptionKey = await Did.DidResolver.resolveKey(encryptionKeyId);
    return encryptionKey
}

const cTypes = [

    {
        name: 'peregrine email',
        cTypeHash:
            '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
    },
    {
        name: 'peregrine github',
        cTypeHash:
            '0xad52bd7a8bd8a52e03181a99d2743e00d0a5e96fdc0182626655fcf0c0a776d0',
    },
    {
        name: 'peregrine twitch',
        cTypeHash:
            '0x568ec5ffd7771c4677a5470771adcdea1ea4d6b566f060dc419ff133a0089d80',
    },
    {
        name: 'peregrine twitter',
        cTypeHash:
            '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
    },
    {
        name: 'peregrine discord',
        cTypeHash:
            '0xd8c61a235204cb9e3c6acb1898d78880488846a7247d325b833243b46d923abe',
    },
]