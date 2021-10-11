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
        const serverScheme = configService.get<string>('server.scheme');
        const serverHost = configService.get<string>('server.host');
        const serverPort = configService.get<string>('server.port');

        return {
            appId,
            appSecret,
            redirectUrl: `${serverScheme}://${serverHost}:${serverPort}/api/v1/auth/response`
        }
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};
