import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider,
    ClientProvider,
    MicrosoftSetupParamsProvider,
    MetaverseContractProvider,
    MetaverseContractChainProvider,
    MulticallContractProvider,
    MulticallContractChainProvider,
    ImportableAssetsProvider,
    ImportableAssetsChainProvider,
    EnrapturableAssetsProvider,
    EnrapturableAssetsChainProvider
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
        MulticallContractChainProvider,
        EnrapturableAssetsProvider,
        EnrapturableAssetsChainProvider,
        ImportableAssetsProvider,
        ImportableAssetsChainProvider
    ],
    exports: [
        OracleWalletProvider,
        EthClientProvider,
        ClientProvider,
        MicrosoftSetupParamsProvider,
        MulticallContractProvider,
        MulticallContractChainProvider,
        MetaverseContractProvider,
        MetaverseContractChainProvider,
        EnrapturableAssetsProvider,
        EnrapturableAssetsChainProvider,
        ImportableAssetsProvider,
        ImportableAssetsChainProvider
    ]
})
export class ProviderModule {}
