import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber } from "class-validator"

export class ExportDto {
    
    @ApiProperty({ description: 'Hash of the asset to export'})
    @IsString()
    hash: string

    @ApiProperty({ description: 'Chain ID'})
    @IsNumber()
    chainId: number
}