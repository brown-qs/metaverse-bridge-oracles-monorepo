import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"


export class AssetDto {
     
    @ApiProperty({ description: 'Asset name'})
    @IsString()
    name: string

    @ApiProperty({ description: 'Asset address'})
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id'})
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type'})
    @IsString()
    assetType: string

    @ApiProperty({ description: 'Amount of the asset in ether'})
    @IsString()
    amount: string

    @ApiProperty({ description: 'Whether the asset can be exported as a token.'})
    @IsBoolean()
    exportable: boolean

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsBoolean()
    summonable: boolean

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsString()
    recognizedAssetType: string

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsBoolean()
    enraptured: boolean

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsString()
    exportChainName: string

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsString()
    exportAddress: string

    @ApiProperty({ description: 'Hash of the entry. Needed for exports.'})
    @IsString()
    hash?: string
}

export class TextureDto {

    @ApiProperty({ description: 'Asset address'})
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id'})
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type'})
    @IsString()
    assetType: string

    @ApiProperty({ description: 'Texture data'})
    @IsString()
    textureData: string

    @ApiProperty({ description: 'Texture signature'})
    @IsString()
    textureSignature: string

    @ApiProperty({ description: 'Whether the skin can be selected.'})
    @IsBoolean()
    selectable: boolean

    @ApiProperty({ description: 'Name for the skin'})
    @IsString()
    name?: string

    @ApiProperty({ description: 'Whether the skin is the currently equipped one.'})
    @IsBoolean()
    equipped: boolean
}

export class ThingsDto {

    @ApiProperty({ description: 'Textures available', isArray: true})
    assets: AssetDto[]
    
    @ApiProperty({ description: 'Available textures of the user', isArray: true})
    textures: TextureDto[]

    @ApiProperty({ description: 'In-game resources available to summon', isArray: true })
    resources: AssetDto[]
}
