import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderToken } from './token';

export const EthClientProvider: FactoryProvider<ethers.providers.JsonRpcProvider> = {
    provide: ProviderToken.CLIENT_ETHEREUM,
    useFactory: (configService: ConfigService) => {
        const rpcUrl = configService.get<string>('network.rpc');
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        return provider
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};
