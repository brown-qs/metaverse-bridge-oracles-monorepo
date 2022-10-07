import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"


export class AssetDto {
    @ApiProperty({ description: 'Asset name' })
    @IsString()
    name: string

    @ApiProperty({ description: 'Asset address' })
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id' })
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type' })
    @IsString()
    assetType: string

    @ApiProperty({ description: 'Amount of the asset in ether' })
    @IsString()
    amount: string

    @ApiProperty({ description: 'Whether the asset can be exported as a token' })
    @IsBoolean()
    exportable: boolean

    @ApiProperty({ description: 'Whether the asset can be summoned as a token' })
    @IsBoolean()
    summonable: boolean

    @ApiProperty({ description: 'Recognized Asset Type, MSAMA | TICKET | TEST | PLOT | OFFHAND | WEAPON_SKIN | TEMPORARY_TICKET' })
    @IsString()
    recognizedAssetType: string

    @ApiProperty({ description: 'Whether the asset is enraptured' })
    @IsBoolean()
    enraptured: boolean

    @ApiPropertyOptional({ description: 'Chain id where asset lives' })
    @IsString()
    chainId: number

    @ApiProperty({ description: 'Address where the asset can be exported to' })
    @IsString()
    exportAddress: string

    @ApiProperty({ description: 'Hash of the entry. Needed for exports.' })
    @IsString()
    hash?: string
}

export class TextureDto {
    @ApiProperty({ description: 'Skin id from database' })
    @IsString()
    id: string

    @ApiProperty({ description: 'Asset address' })
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id' })
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type' })
    @IsString()
    assetType: string

    @ApiProperty({ description: 'Texture data' })
    @IsString()
    textureData: string

    @ApiProperty({ description: 'Texture signature' })
    @IsString()
    textureSignature: string

    @ApiProperty({ description: 'Whether the skin can be selected.' })
    @IsBoolean()
    selectable: boolean

    @ApiProperty({ description: 'Name for the skin' })
    @IsString()
    name?: string

    @ApiProperty({ description: 'Whether the skin is the currently equipped one.' })
    @IsBoolean()
    equipped: boolean
}

export class ThingsDto {

    @ApiProperty({ description: 'Textures available', isArray: true })
    assets: AssetDto[]

    @ApiProperty({ description: 'Available textures of the user', isArray: true })
    textures: TextureDto[]

    @ApiProperty({ description: 'In-game resources available to summon', isArray: true })
    resources: AssetDto[]
}
