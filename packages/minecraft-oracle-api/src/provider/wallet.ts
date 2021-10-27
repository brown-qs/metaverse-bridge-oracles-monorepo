import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ProviderToken } from './token';
const METAVERSE_ABI = require('../common/contracts/Metaverse.json');
import { METAVERSE_ADDRESSES } from 'src/config/constants';

export const OracleWalletProvider: FactoryProvider<ethers.Wallet> = {
    provide: ProviderToken.ORACLE_WALLET,
    useFactory: (configService: ConfigService, client: ethers.providers.Provider) => {
        const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');
        return new ethers.Wallet(oraclePrivateKey, client);
    },
    inject: [ConfigService, ProviderToken.CLIENT_ETHEREUM],
    scope: Scope.DEFAULT
};

export const MetaverseContractProvider: FactoryProvider<ethers.Contract> = {
    provide: ProviderToken.METAVERSE_CONTRACT,
    useFactory: (configService: ConfigService, client: ethers.providers.Provider) => {
        const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');
        const chainId = configService.get<number>('network.chainId');
        const oracle = new ethers.Wallet(oraclePrivateKey, client);
        return new Contract(METAVERSE_ADDRESSES[chainId], METAVERSE_ABI, oracle)
    },
    inject: [ConfigService, ProviderToken.CLIENT_ETHEREUM],
    scope: Scope.DEFAULT
};
