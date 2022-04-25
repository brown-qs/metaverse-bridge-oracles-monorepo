import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EvmChainClientProvider,
    MicrosoftSetupParamsProvider,
} from '.';

@Module({
    providers: [
        OracleWalletProvider,
        EvmChainClientProvider,
        MicrosoftSetupParamsProvider
    ],
    exports: [
        OracleWalletProvider,
        EvmChainClientProvider,
        MicrosoftSetupParamsProvider
    ]
})
export class ProviderModule {}
