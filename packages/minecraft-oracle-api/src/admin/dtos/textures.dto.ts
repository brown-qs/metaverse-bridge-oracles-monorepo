import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { StringAssetType } from "src/common/enums/AssetType"
import { TextureType } from "src/texture/texturetype.enum";

export class TextureDto {

    @ApiProperty({ description: 'Texture asset type'})
    assetType: StringAssetType;

    @ApiProperty({ description: 'Texture asset address'})
    assetAddress: string;

    @ApiProperty({ description: 'Texture asset id'})
    assetId: string;

    @ApiProperty({ description: 'Texture type'})
    type: TextureType;
    
    @ApiProperty({ description: 'Texture data'})
    textureData: string;

    @ApiProperty({ description: 'Texture signature'})
    textureSignature: string;
}

export class TexturesDto {

    @ApiProperty({ description: 'List of textures', default: [], isArray: true})
    textures: TextureDto[]
}