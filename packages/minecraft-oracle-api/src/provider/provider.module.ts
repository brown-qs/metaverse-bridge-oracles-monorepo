import { Module } from '@nestjs/common';
import {
    OracleWalletProvider,
    EthClientProvider
} from '.';

@Module({
    providers: [
        OracleWalletProvider,
        EthClientProvider
    ],
    exports: [
        OracleWalletProvider,
        EthClientProvider
    ]
})
export class ProviderModule {}
