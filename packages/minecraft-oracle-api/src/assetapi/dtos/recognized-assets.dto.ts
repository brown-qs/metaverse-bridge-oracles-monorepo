import { StringAssetType } from "../../common/enums/AssetType"
import { RecognizedAssetType } from "../../config/constants"

export class RecognizedAssetsDto {
    chainId: number
    assetAddress: string
    assetType: StringAssetType
    name: string
    collectionFragments: CollectionFragmentDto[]
}

export class CollectionFragmentDto {
    recognizedAssetType: RecognizedAssetType
    decimals: number
    treatAsFungible: boolean
    enrapturable: boolean
    importable: boolean
    exportable: boolean
    summonable: boolean
    gamepass: boolean
    name: string
    idRange: number[] | null
}