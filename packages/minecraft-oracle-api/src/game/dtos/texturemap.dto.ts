import { TextureType } from "../../texture/texturetype.enum";

export type PlayerSkinDto = {
    textureData: string
    textureSignature: string
    type: TextureType
    accessories: string[] | undefined
    assetId: string
    equipped: boolean
}