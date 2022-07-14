import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserService } from '../../user/user/user.service';
import { MicrosoftAccount, MicrosoftAuth } from '../../minecraftauth'
import { ConfigService } from '@nestjs/config';
import { ProviderToken } from '../../provider/token';
import { MicrosoftSetupParams } from '../../provider';
import { UserEntity } from '../../user/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MinecraftAuthService {

    private readonly context: string;

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,

        @Inject(ProviderToken.MICROSOFT_SETUP) private readonly microsoftSetupParams: MicrosoftSetupParams,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MinecraftAuthService.name;
    }

    public generateJwtToken(uuid: string, userName: string): string {
        const payload = { sub: uuid };
        return this.jwtService.sign(payload);
    }

    public async getMicrosoftAuthUrl(): Promise<{ redirectUrl: string }> {
        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl,
        )
        const redirectUrl = MicrosoftAuth.createUrl()
        this.logger.debug(`getMicrosoftAuthUrl:: created URL: ${redirectUrl}`);
        return { redirectUrl }
    }

    public async authLogin(code: string) {

        let account = new MicrosoftAccount();

        this.logger.log(`authLogin: ${account}`, this.context);

        const successfulAuthRedirect = this.configService.get<string>('app.redirect')


        MicrosoftAuth.setup(
            this.microsoftSetupParams.appId,
            this.microsoftSetupParams.appSecret,
            this.microsoftSetupParams.redirectUrl,
        )

        let accessToken: string
        try {
            accessToken = await account.authFlow(code)
        } catch (err: any) {
            this.logger.error('authLogin:: auth flow error', null, this.context)
            this.logger.error(err, null, this.context)
            throw new UnprocessableEntityException('Microsoft auth flow error')
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000)

        try {
            await account.getProfile()
        } catch (err: any) {
            this.logger.error('authLogin:: error authenticating user', null, this.context)
            this.logger.error(err, null, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }

        if (!!account.uuid && !!account.username) {
            //account.uuid > minecraft uuid
            //account.username > minecraft username
            //hasGame: account.ownership ?? false   

            this.logger.log(`Account: ${JSON.stringify(account)}`, this.context);
            return { minecraftUuid: account.uuid, minecraftUserName: account.username, ownership: account.ownership ?? false }
        } else {
            this.logger.error('authLogin:: user uuid and userName was not received', null, this.context)
            throw new UnprocessableEntityException('User profile could not be fetched.')
        }
    }
}