import { ApiProperty } from "@nestjs/swagger"
import { StringAssetType } from "../../common/enums/AssetType"
import { TextureType } from "../../texture/texturetype.enum";

export class TextureDto {

    @ApiProperty({ description: 'Texture asset type', enum: StringAssetType})
    assetType: StringAssetType;

    @ApiProperty({ description: 'Texture asset address'})
    assetAddress: string;

    @ApiProperty({ description: 'Texture asset id'})
    assetId: string;

    @ApiProperty({ description: 'Texture type', enum: TextureType})
    type: TextureType;
    
    @ApiProperty({ description: 'Texture data'})
    textureData: string;

    @ApiProperty({ description: 'Texture signature'})
    textureSignature: string;
}

export class TexturesDto {

    @ApiProperty({ description: 'List of textures', type: [TextureDto]})
    textures: TextureDto[]
}