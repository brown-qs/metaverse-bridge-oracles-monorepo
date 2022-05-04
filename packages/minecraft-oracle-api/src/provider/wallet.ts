import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderToken } from './token';
import { TypeEvmChainClientProvider } from './client';

export type TypeOracleWalletProvider = (chainId: number) => Promise<ethers.Wallet>;

export const OracleWalletProvider: FactoryProvider<TypeOracleWalletProvider> = {
    provide: ProviderToken.ORACLE_WALLET_CALLBACK,
    useFactory: (configService: ConfigService, getClient: TypeEvmChainClientProvider) => {
        const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');

        const getOracleWallet = async (chainId: number) => {
            const client = await getClient(chainId);
            if (!client) {
                return undefined
            }
            return (new ethers.Wallet(oraclePrivateKey, client));
        }
        return getOracleWallet;

    },
    inject: [ConfigService, ProviderToken.CLIENT_EVM_CHAIN],
    scope: Scope.DEFAULT
};