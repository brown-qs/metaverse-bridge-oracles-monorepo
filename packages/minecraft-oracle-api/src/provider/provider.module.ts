import { Module } from '@nestjs/common';
import { ChainModule } from '../chain/chain.module';
import {
    OracleWalletProvider,
    EvmChainClientProvider,
    MicrosoftSetupParamsProvider,
    RecognizedAssetsProvider,
    RecognizedChainAssetsProvider,
    S3ClientProvider
} from '.';
import { ContractsCallbackProvider } from './contract';
import { CollectionFragmentModule } from '../collectionfragment/collectionfragment.module';

@Module({
    imports: [
        ChainModule,
        CollectionFragmentModule
    ],
    providers: [
        OracleWalletProvider,
        EvmChainClientProvider,
        MicrosoftSetupParamsProvider,
        RecognizedChainAssetsProvider,
        RecognizedAssetsProvider,
        ContractsCallbackProvider,
        S3ClientProvider
    ],
    exports: [
        OracleWalletProvider,
        EvmChainClientProvider,
        MicrosoftSetupParamsProvider,
        RecognizedChainAssetsProvider,
        RecognizedAssetsProvider,
        ContractsCallbackProvider,
        S3ClientProvider
    ]
})
export class ProviderModule {}
