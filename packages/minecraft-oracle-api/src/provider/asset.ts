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
