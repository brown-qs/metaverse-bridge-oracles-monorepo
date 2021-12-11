import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    MicrosoftSetupParamsProvider,
    MetaverseContractProvider,
    MulticallContractProvider,
    ImportableAssetsProvider,
    EnrapturableAssetsProvider
} from '.';

@Module({
    providers: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider,
        MetaverseContractProvider,
        MulticallContractProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ],
    exports: [
        OracleWalletProvider,
        EthClientProvider,
        MicrosoftSetupParamsProvider,
        MulticallContractProvider,
        MetaverseContractProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ]
})
export class ProviderModule {}
