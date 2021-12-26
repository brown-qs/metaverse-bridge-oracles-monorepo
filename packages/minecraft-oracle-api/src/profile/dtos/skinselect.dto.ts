import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class SkinselectDto {
    
    @ApiProperty({ description: 'Asset address'})
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id'})
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type'})
    @IsString()
    assetType: string
}
