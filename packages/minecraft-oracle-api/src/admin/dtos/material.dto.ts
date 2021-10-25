import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { StringAssetType } from "src/common/enums/AssetType"

export class MaterialDto {
    @ApiProperty({ description: 'Material name'})
    name: string

    @ApiProperty({ description: 'Material key'})
    key: string

    @ApiProperty({ description: 'Material ordinal'})
    ordinal: number

    @ApiPropertyOptional({ description: 'Material ordinal'})
    hashCode: number

    @ApiProperty({ description: 'Material max stack size'})
    maxStackSize: number;

    @ApiProperty({ description: 'Material asset type'})
    assetType: StringAssetType;

    @ApiProperty({ description: 'Material asset address'})
    assetAddress: string;

    @ApiProperty({ description: 'Material asset id'})
    assetId: string;

    @ApiProperty({ description: 'Is material snapshottable from the game'})
    snapshottable: boolean;
    
    @ApiProperty({ description: 'Is material importale into the game'})
    importable: boolean;

    @ApiProperty({ description: 'Is material exportable as an ERC token'})
    exportable: boolean;

    @ApiProperty({ description: 'Is material equippable into the game'})
    equippable: boolean;
}

export class MaterialsDto {

    @ApiProperty({ description: 'List of materials', default: [], isArray: true})
    materials: MaterialDto[]
}