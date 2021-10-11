import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    MicrosoftSetupParamsProvider
} from '.';

@Module({
    providers: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider
    ],
    exports: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider
    ]
})
export class ProviderModule {}
