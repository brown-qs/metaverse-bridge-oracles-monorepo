import { FactoryProvider, Scope } from '@nestjs/common';
import { ProviderToken } from './token';
import { ChainService } from '../chain/chain.service';
import { BridgeAssetType } from '../common/enums/AssetType';
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';


export type TypeRecognizedChainAssetsProvider = (chainId: number, bridgeAssetType: BridgeAssetType) => Promise<CollectionFragmentEntity[]>
export type TypeRecognizedAssetsProvider = (bridgeAssetType: BridgeAssetType) => Promise<CollectionFragmentEntity[]>

export const RecognizedChainAssetsProvider: FactoryProvider<TypeRecognizedChainAssetsProvider> = {
    provide: ProviderToken.RECOGNIZED_CHAIN_ASSETS_CALLBACK,
    useFactory: (chainService: ChainService, collectionFragmentService: CollectionFragmentService) => {
        const getRecognizedChainAssets = async (chainId: number, bridgeAssetType: BridgeAssetType) => {
            const chain = await chainService.findOne({ chainId });
            if (!chain) {
                return [];
            }

            if (bridgeAssetType.valueOf() === BridgeAssetType.ENRAPTURED.valueOf()) {
                const enrapturableAssets = await collectionFragmentService.findMany({ where: { collection: { chainId: chain.chainId }, enrapturable: true }, relations: ['collection'] })
                return enrapturableAssets
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.IMPORTED.valueOf()) {
                const importableAssets = await collectionFragmentService.findMany({ where: { collection: { chainId: chain.chainId }, importable: true }, relations: ['collection'] })
                //console.log(importableAssets)
                return importableAssets
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.EXPORTED.valueOf()) {
                const exportableAssets = await collectionFragmentService.findMany({ where: { collection: { chainId: chain.chainId }, exportable: true }, relations: ['collection'] })
                return exportableAssets
            } else {
                return []
            }
        }
        return getRecognizedChainAssets;
    },
    inject: [ChainService, CollectionFragmentService],
    scope: Scope.DEFAULT
};

export const RecognizedAssetsProvider: FactoryProvider<TypeRecognizedAssetsProvider> = {
    provide: ProviderToken.RECOGNIZED_ASSETS_CALLBACK,
    useFactory: (collectionFragmentService: CollectionFragmentService) => {
        const getRecognizedAssets = async (bridgeAssetType: BridgeAssetType) => {
            if (bridgeAssetType.valueOf() === BridgeAssetType.ENRAPTURED.valueOf()) {
                const enrapturableAssets = await collectionFragmentService.findMany({ where: { enrapturable: true }, relations: ['collection'] })
                return enrapturableAssets
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.IMPORTED.valueOf()) {
                const importableAssets = await collectionFragmentService.findMany({ where: { importable: true }, relations: ['collection'] })
                return importableAssets
            } else if (bridgeAssetType.valueOf() === BridgeAssetType.EXPORTED.valueOf()) {
                const exportableAssets = await collectionFragmentService.findMany({ where: { exportable: true }, relations: ['collection'] })
                return exportableAssets
            } else {
                return []
            }
        }
        return getRecognizedAssets;
    },
    inject: [CollectionFragmentService],
    scope: Scope.DEFAULT
};
