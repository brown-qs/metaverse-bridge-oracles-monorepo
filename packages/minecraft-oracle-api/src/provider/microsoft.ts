import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ProviderToken } from './token';

export type MicrosoftSetupParams = {
    appId: string;
    appSecret: string;
    redirectUrl: string;
}

export const MicrosoftSetupParamsProvider: FactoryProvider<MicrosoftSetupParams> = {
    provide: ProviderToken.MICROSOFT_SETUP,
    useFactory: (configService: ConfigService) => {
        const appId = configService.get<string>('app.id');
        const appSecret = configService.get<string>('app.secret');
        const redirectUrl = configService.get<string>('server.redirect');

        return {
            appId,
            appSecret,
            redirectUrl: `${redirectUrl}/api/v1/auth/response`
        }
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};
