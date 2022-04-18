import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { ProviderToken } from './token';
import { ENRAPTURABLE_ASSETS, IMPORTABLE_ASSETS, RecognizedAsset } from '../config/constants';

export const ImportableAssetsProvider: FactoryProvider<RecognizedAsset[]> = {
    provide: ProviderToken.IMPORTABLE_ASSETS,
    useFactory: (configService: ConfigService) => {
        const chainId = configService.get<number>('network.chainId');
        const assets = IMPORTABLE_ASSETS.filter(x => x.chainId.valueOf() === chainId)
        return assets
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};

export const ImportableAssetsChainProvider: FactoryProvider = {
    provide: ProviderToken.IMPORTABLE_ASSETS_CHAIN,
    useFactory: (configService: ConfigService) => {
        const chainIds = configService.get<number[]>('network.chainIds');
        let assets: any = {};
        chainIds.map((chainId: number) => {
            assets[chainId] = IMPORTABLE_ASSETS.filter(x => x.chainId.valueOf() === chainId)
        })
        return assets;
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};

export const EnrapturableAssetsProvider: FactoryProvider<RecognizedAsset[]> = {
    provide: ProviderToken.ENRAPTURABLE_ASSETS,
    useFactory: (configService: ConfigService) => {
        const chainId = configService.get<number>('network.chainId');
        const assets = ENRAPTURABLE_ASSETS.filter(x => x.chainId.valueOf() === chainId)
        return assets
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};

export const EnrapturableAssetsChainProvider: FactoryProvider = {
    provide: ProviderToken.ENRAPTURABLE_ASSETS_CHAIN,
    useFactory: (configService: ConfigService) => {
        const chainIds = configService.get<number[]>('network.chainIds');
        let assets: any = {};
        chainIds.map((chainId: number) => {
            assets[chainId] = ENRAPTURABLE_ASSETS.filter(x => x.chainId.valueOf() === chainId)
        })
        return assets;
    },
    inject: [ConfigService],
    scope: Scope.DEFAULT
};
