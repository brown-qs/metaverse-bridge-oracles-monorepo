import { FactoryProvider, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderToken } from './token';
import { ChainService } from '../chain/chain.service';

export type TypeEvmChainClientProvider = (chainId: number) => Promise<ethers.providers.JsonRpcProvider | undefined>

export const EvmChainClientProvider: FactoryProvider<TypeEvmChainClientProvider> = {
    provide: ProviderToken.CLIENT_EVM_CHAIN,
    useFactory: (chainService: ChainService) => {
        const getRpc = async (chainId: number) => {
            const chain = await chainService.findOne({ chainId });
            if (!chain) {
                return undefined;
            }
            const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
            return provider;
        }
        return getRpc;
    },
    inject: [ChainService],
    scope: Scope.DEFAULT
};
