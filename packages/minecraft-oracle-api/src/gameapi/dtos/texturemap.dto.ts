import { ApiProperty } from "@nestjs/swagger";
import { StringAssetType } from "../../common/enums/AssetType";
import { TextureType } from "../../texture/texturetype.enum";

export class PlayerSkinDto {
    @ApiProperty()
    textureData: string

    @ApiProperty()
    textureSignature: string

    @ApiProperty()
    type: TextureType

    @ApiProperty()
    accessories: string[] | undefined

    @ApiProperty()
    assetId: string

    @ApiProperty()
    assetAddress: string

    @ApiProperty()
    assetType: StringAssetType

    @ApiProperty()
    equipped: boolean
}