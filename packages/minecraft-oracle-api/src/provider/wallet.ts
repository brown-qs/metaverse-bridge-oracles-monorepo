import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderToken } from './token';

export const OracleWalletProvider: FactoryProvider<ethers.Wallet> = {
    provide: ProviderToken.ORACLE_WALLET,
    useFactory: (configService: ConfigService, client: ethers.providers.Provider) => {
        const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');
        return new ethers.Wallet(oraclePrivateKey, client);
    },
    inject: [ConfigService, ProviderToken.CLIENT_ETHEREUM],
    scope: Scope.DEFAULT
};