import { StringAssetType } from "src/common/enums/AssetType";
import { TextureType } from "../../texture/texturetype.enum";

export type PlayerSkinDto = {
    textureData: string
    textureSignature: string
    type: TextureType
    accessories: string[] | undefined
    assetId: string
    assetAddress: string
    assetType: StringAssetType
    equipped: boolean
}