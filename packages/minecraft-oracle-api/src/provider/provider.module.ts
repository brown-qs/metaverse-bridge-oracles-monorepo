import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    MicrosoftSetupParamsProvider,
    MetaverseContractProvider,
    MetaverseContractChainProvider,
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
        MetaverseContractChainProvider,
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
        MetaverseContractChainProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ]
})
export class ProviderModule {}
