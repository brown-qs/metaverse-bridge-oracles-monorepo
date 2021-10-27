import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class ExportDto {
    
    @ApiProperty({ description: 'Hash of the asset to export'})
    @IsString()
    hash: string
}