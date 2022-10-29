import { StringAssetType } from "../../common/enums/AssetType"

export interface CompositeConfigDto {
    chainId: number,
    assetAddress: string,
    assetType: StringAssetType,
    name: string,
    parts: CompositeConfigPartDto[]
}

export interface CompositeConfigPartDto {
    chainId: number,
    assetAddress: string,
    assetType: StringAssetType,
    name: string,
    synthetic: boolean,
    items: CompositeConfigItemDto[]
}

export interface CompositeConfigItemDto {
    id: string,
    assetId: number,
    previewImageUri: string,
    attributes: CompositeConfigNftAttribute[],
    layers: CompositeConfigLayer[]
}

export interface CompositeConfigNftAttribute {
    trait_name: string,
    value: string
}

export interface CompositeConfigLayer {
    id: string,
    zIndex: number,
    imageUri: string
}