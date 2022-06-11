import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserService } from '../user/user.service';

import { MicrosoftAccount, MicrosoftAuth } from '../minecraftauth'
import { ConfigService } from '@nestjs/config';
import { ProviderToken } from '../provider/token';
import { MicrosoftSetupParams } from '../provider';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class KiltAuthApiService {

    private readonly context: string;

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthApiService.name;
    }

    async validateSession(session: { encryptionKeyId: string, encryptedChallenge: string, nonce: string, sessionId: string }) {
        /*
        // load the session, fail if null
        const session = storage.get(sessionId)
        if (!session) return exit(res, 500, 'invalid session');

        // load the encryption key
        const encryptionKey = await getEncryptionKey(encryptionKeyId)
        if (!encryptionKey) return exit(res, 500, `failed resolving ${encryptionKeyId}`);

        // decrypt the message
        const decrypted = await decryptChallenge(encryptedChallenge, encryptionKey, nonce);
        if (decrypted !== session.challenge) return exit(res, 500, 'challenge mismatch');

        // update the session
        storage.put(sessionId, {
            ...session,
            did: encryptionKey.controller,
            encryptionKeyId,
            didConfirmed: true,
        });
        */
    }


    async returnSessionValues(session: { encryptionKeyId: string, encryptedChallenge: string, nonce: string, sessionId: string }) {
        /*
        await cryptoWaitReady()
        await init({ address: process.env.WSS_ADDRESS })
        // create session data
        const fullDid = await getFullDid()
        const dAppEncryptionKeyId = fullDid.assembleKeyId(fullDid.encryptionKey.id);

        const session = {
            sessionId: randomAsHex(),
            challenge: randomAsHex(),
            dappName: process.env.DAPP_NAME,
            dAppEncryptionKeyId,
        };

        // store it in session
        storage.put(session.sessionId, session);
        */
    }
}
