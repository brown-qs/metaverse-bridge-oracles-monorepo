import { init, IEncryptedMessage, Utils, MessageBodyType, Message, ICredential, Did, Credential, DidUri, connect, DidResourceUri } from '@kiltprotocol/sdk-js';
import { GoneException, Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { blake2AsU8a, cryptoWaitReady, keyExtractPath, keyFromPath, mnemonicToMiniSecret, naclBoxPairFromSecret, naclOpen, naclSeal, randomAsHex, sr25519PairFromSeed } from '@polkadot/util-crypto';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { WalletLoginMessage } from './dtos';
import { KiltSessionService } from 'src/kilt-session/kilt-session.service';
import { KiltSessionEntity } from 'src/kilt-session/kilt-session.entity';
import { decryptChallenge, encryptionKeystore, getEncryptionKey, getFullDid } from 'src/kilt-session/helpers';
import { KiltDidEmailService } from 'src/user/kilt-did-email/kilt-did-email.service';
import { UserService } from 'src/user/user/user.service';
import { UserEntity } from 'src/user/user/user.entity';


@Injectable()
export class KiltAuthService {
    private readonly context: string;

    constructor(
        private kiltDidEmailService: KiltDidEmailService,
        private kiltSessionService: KiltSessionService,
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthService.name;

    }

    async initKilt() {
        await cryptoWaitReady()
        await init({ address: this.configService.get<string>('kilt.wssAddress') })
        await connect()
    }

    async getWalletSessionChallenge(): Promise<KiltSessionEntity> {
        await this.initKilt()
        await cryptoWaitReady()
        await init({ address: this.configService.get<string>('kilt.wssAddress') })
        // create session data
        const fullDid = await getFullDid()

        const dAppEncryptionKeyUri = fullDid.assembleKeyUri(fullDid.encryptionKey.id);


        return await this.kiltSessionService.create(randomAsHex(), randomAsHex(), this.configService.get<string>('kilt.dappName'), dAppEncryptionKeyUri)
    }


    async verifyWalletSessionChallenge(encryptionKeyUri: DidResourceUri, encryptedWalletSessionChallenge: string, nonce: string, sessionId: string) {
        await this.initKilt()


        const session = await this.kiltSessionService.findBySessionId(sessionId)
        if (!session) {
            this.logger.error(`kiltAuthVerifyChallenge:: sessionId: ${sessionId} not found`, null, this.context)
            throw new GoneException("session gone")
        }

        // load the encryption key
        let encryptionKey
        try {
            encryptionKey = await getEncryptionKey(encryptionKeyUri)

        } catch (err) {
            this.logger.error(`kiltAuthVerifyChallenge:: failed resolving ${encryptionKeyUri}`, err, this.context)
            throw new UnprocessableEntityException
        }


        // decrypt the message
        const decrypted = await decryptChallenge(encryptedWalletSessionChallenge, encryptionKey, nonce);
        if (decrypted !== session.walletSessionChallenge) {
            this.logger.error(`kiltAuthVerifyChallenge:: challenge mismatch`, null, this.context)
            throw new UnprocessableEntityException
        }

        await this.kiltSessionService.update({ sessionId }, { encryptedDid: encryptionKey.controller, encryptionKeyUri, didConfirmed: true })
    }

    async getWalletLoginChallenge(sessionId: string): Promise<IEncryptedMessage> {
        await this.initKilt()

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
        await this.kiltSessionService.update({ sessionId }, { walletLoginChallenge })

        // construct the message
        const cType = {
            name: this.configService.get<string>('kilt.cTypeName'),
            cTypeHash: this.configService.get<string>('kilt.cTypeHash')
        }
        const cTypes = [cType]
        const content = { cTypes, challenge: walletLoginChallenge } as any;
        const type = MessageBodyType.REQUEST_CREDENTIAL;
        const didUri = process.env.KILT_VERIFIER_DID_URI as DidUri;
        const keyDid = encryptionKeyUri.replace(/#.*$/, '') as DidUri;
        const message = new Message({ content, type }, didUri, keyDid);
        if (!message) {
            this.logger.error(`walletCredentialMessage:: failed to construct message`, null, this.context)
            throw new UnprocessableEntityException
        }
        const fullDid = await getFullDid();
        // encrypt the message
        let output
        try {
            output = await message.encrypt(fullDid.encryptionKey.id, fullDid, encryptionKeystore, encryptionKeyUri);

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
        await this.initKilt()

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
        const fullDid = await getFullDid();
        const message = await Message.decrypt(rawMessage, encryptionKeystore, fullDid);
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


        await this.kiltSessionService.update({ sessionId }, { verified: true, did })

        this.logger.debug(`"successfully logged in kilt as: ${email}`, this.context)

        //clean up session
        await this.kiltSessionService.remove(session)
        //log did/email association
        await this.kiltDidEmailService.create(email.toLowerCase().trim(), did)
        return await this.userService.createEmail(email.toLowerCase().trim())
    }
}



