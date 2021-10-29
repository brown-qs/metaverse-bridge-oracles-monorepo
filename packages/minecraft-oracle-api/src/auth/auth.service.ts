import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserService } from '../user/user.service';

import {MicrosoftAccount, MicrosoftAuth} from 'minecraft-auth'
import { ConfigService } from '@nestjs/config';
import { ProviderToken } from '../provider/token';
import { MicrosoftSetupParams } from '../provider';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AuthService {

    private readonly context: string;

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private cacheService: CacheService,
        private jwtService: JwtService,
        @Inject(ProviderToken.MICROSOFT_SETUP) private readonly microsoftSetupParams: MicrosoftSetupParams,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = AuthService.name;
    }

    public generateJwtToken(uuid: string, userName: string): string {
        const payload = {sub: uuid, userName};
        return this.jwtService.sign(payload);
    }

    public async getMicrosoftAuthUrl(): Promise<{ redirectUrl: string }> {

        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl
        )

        const redirectUrl = MicrosoftAuth.createUrl()
        this.logger.debug(`getMicrosoftAuthUrl:: created URL: ${redirectUrl}`);

        return { redirectUrl }
    }

    public async authLogin(code: string) {

        let account = new MicrosoftAccount();

        console.log(account);

        const successfulAuthRedirect = this.configService.get<string>('app.redirect')

        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl
        )
        let accessToken: string

        try {
            accessToken = await account.authFlow(code)
            await account.getProfile()
        } catch (err: any) {
            this.logger.error('authLogin:: error authenticating user', err, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }

        if (account.uuid && account.username && account.ownership) {
            const userData = {
                uuid: account.uuid,
                userName: account.username,
                hasGame: account.ownership ?? null
            }
            let user: UserEntity
            try {
                user = await this.userService.create(userData)
            } catch (err) {
                this.logger.error(`authLogin: error upserting user into database: ${JSON.stringify(userData)}`, err, this.context)
                throw new UnprocessableEntityException(`Error upserting user into database: ${JSON.stringify(userData)}`)
            }
            this.logger.log(`Account: ${JSON.stringify(account)}`, this.context);

            const jwt = this.generateJwtToken(user.uuid, user.userName);
            const redirectLink = `${successfulAuthRedirect}/${jwt}`
            
            /*
            if(!await this.cacheService.createSession(jwt, user.uuid)) {
                this.logger.error(`authLogin: user was created but caching was unsuccessful`, JSON.stringify({uuid: user.uuid, jwt}), this.context)
                throw new UnprocessableEntityException(`Unsuccessful caching for ${JSON.stringify({uuid: user.uuid, jwt})}`)
            }
            */

            this.logger.log(`authLogin:: successful login for user (${user.uuid}, ${user.userName}). Redirect link: ${redirectLink}`)

            return {
                jwt,
                user,
                redirectUrl: redirectLink
            }

        } else {
            this.logger.error('authLogin:: user uuid and userName was not received', null, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }
    }
}
