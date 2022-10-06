import { StringAssetType } from "../../common/enums/AssetType"
import { MultiverseVersion, RecognizedAssetType } from "../../config/constants"

export class RecognizedAssetsDto {
    chainId: number
    multiverseV1Address: string
    multiverseV2Address: string
    assetAddress: string
    assetType: StringAssetType
    name: string
    multiverseVersion: MultiverseVersion
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