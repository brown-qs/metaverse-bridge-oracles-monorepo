import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateMetadataDto {
    @ApiProperty({ description: 'Hash of staked item', required: true })
    @IsNotEmpty()
    @IsString()
    hash: string
}