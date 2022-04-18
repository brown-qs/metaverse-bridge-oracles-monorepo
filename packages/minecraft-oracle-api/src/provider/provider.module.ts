import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    ClientProvider,
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
        ClientProvider,
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
        ClientProvider,
        MicrosoftSetupParamsProvider,
        MulticallContractProvider,
        MetaverseContractProvider,
        MetaverseContractChainProvider,
        EnrapturableAssetsProvider,
        ImportableAssetsProvider
    ]
})
export class ProviderModule {}
