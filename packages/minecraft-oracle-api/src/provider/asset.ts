import { FactoryProvider, Scope } from '@nestjs/common';
import { ProviderToken } from './token';
import { ENRAPTURABLE_ASSETS, IMPORTABLE_ASSETS, RecognizedAsset } from '../config/constants';
import { ChainService } from '../chain/chain.service';
import { BridgeAssetType } from '../common/enums/AssetType';


export type TypeRecognizedChainAssetsProvider = (chainId: number, bridgeAssetType: BridgeAssetType) => Promise<RecognizedAsset[]>
export type TypeRecognizedAssetsProvider = (bridgeAssetType: BridgeAssetType) => Promise<RecognizedAsset[]>

export const RecognizedChainAssetsProvider: FactoryProvider<TypeRecognizedChainAssetsProvider> = {
    provide: ProviderToken.RECOGNIZED_CHAIN_ASSETS_CALLBACK,
    useFactory: (chainService: ChainService) => {
        const getRecognizedChainAssets = async (chainId: number, bridgeAssetType: BridgeAssetType) => {
            const chain = await chainService.findOne({ chainId });
            if (!chain) {
                return [];
            }

            if (bridgeAssetType.valueOf() === BridgeAssetType.ENRAPTURED.valueOf()) {
                return ENRAPTURABLE_ASSETS.filter(x => x.chainId === chainId)
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.IMPORTED.valueOf()) {
                return IMPORTABLE_ASSETS.filter(x => x.chainId === chainId)
            } else {
                return []
            }
        }
        return getRecognizedChainAssets;
    },
    inject: [ChainService],
    scope: Scope.DEFAULT
};

export const RecognizedAssetsProvider: FactoryProvider<TypeRecognizedAssetsProvider> = {
    provide: ProviderToken.RECOGNIZED_ASSETS_CALLBACK,
    useFactory: () => {
        const getRecognizedAssets = async (bridgeAssetType: BridgeAssetType) => {
            if (bridgeAssetType.valueOf() === BridgeAssetType.ENRAPTURED.valueOf()) {
                return ENRAPTURABLE_ASSETS
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.IMPORTED.valueOf()) {
                return IMPORTABLE_ASSETS
            } else {
                return []
            }
        }
        return getRecognizedAssets;
    },
    inject: [ChainService],
    scope: Scope.DEFAULT
};
