import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ProviderToken } from './token';
import {MULTICALL_ABI} from '../common/contracts/Multicall';
import { METAVERSE_ADDRESSES, MULTICALL_ADDRESSES } from '../config/constants';
import { METAVERSE_ABI } from '../common/contracts/Metaverse';

export const MulticallContractProvider: FactoryProvider<ethers.Contract> = {
    provide: ProviderToken.MULTICALL_CONTRACT,
    useFactory: (configService: ConfigService, client: ethers.providers.Provider) => {
        const oraclePrivateKey = configService.get<string>('network.oracle.privateKey');
        const chainId = configService.get<number>('network.chainId');
        const oracle = new ethers.Wallet(oraclePrivateKey, client);
        return new Contract(MULTICALL_ADDRESSES[chainId], MULTICALL_ABI, oracle)
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
