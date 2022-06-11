import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserService } from '../user/user.service';
import { randomAsHex, cryptoWaitReady } from "@polkadot/util-crypto"
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Did, init } from '@kiltprotocol/sdk-js'
import { decryptChallenge, getFullDid } from "../kilt/verifier";
export interface KiltChallengeSession {
    sessionId: string,
    challenge: string,
    dappName: string,
    dAppEncryptionKeyId: string
}

@Injectable()
export class KiltAuthApiService {

    private readonly context: string;
    private readonly challengeSessions: KiltChallengeSession[] = []

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthApiService.name;
    }

    async getChallenge(): Promise<KiltChallengeSession> {
        await cryptoWaitReady()
        await init({ address: process.env.KILT_WSS_ADDRESS })
        // create session data
        const fullDid = await getFullDid()

        const dAppEncryptionKeyId = fullDid.assembleKeyId(fullDid.encryptionKey.id);

        const kiltChallengeSession = {
            sessionId: randomAsHex(),
            challenge: randomAsHex(),
            dappName: process.env.KILT_DAPP_NAME,
            dAppEncryptionKeyId,
        }
        this.challengeSessions.push(kiltChallengeSession)
        return kiltChallengeSession
    }


    async verifyChallenge(encryptionKeyId: string, encryptedChallenge: string, nonce: string, sessionId: string) {

        // load the session, fail if null

        //this.logger.error('authLogin:: auth flow error', null, this.context)

        const session = this.challengeSessions.find(sess => sess.sessionId === sessionId)
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
        const decrypted = await decryptChallenge(encryptedChallenge, encryptionKey, nonce);
        if (decrypted !== session.challenge) {
            this.logger.error(`kiltAuthVerifyChallenge:: challenge mismatch`, null, this.context)
            throw new UnauthorizedException
        }
    }
}

async function getEncryptionKey(encryptionKeyId: string) {
    await cryptoWaitReady();
    await init({ address: process.env.KILT_WSS_ADDRESS });
    const encryptionKey = await Did.DidResolver.resolveKey(encryptionKeyId);
    return encryptionKey
}