import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    MicrosoftSetupParamsProvider,
    MetaverseContractProvider,
    ImportableAssetsProvider,
    EnrapturableAssetsProvider
} from '.';

@Module({
    providers: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider,
        MetaverseContractProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ],
    exports: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider,
        MetaverseContractProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ]
})
export class ProviderModule {}
