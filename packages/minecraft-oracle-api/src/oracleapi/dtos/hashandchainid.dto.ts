import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber, IsNotEmpty } from "class-validator"

export class HashAndChainIdDto {

    @ApiProperty({ description: 'Hash of the asset to export' })
    @IsNotEmpty()
    @IsString()
    hash: string

    @ApiProperty({ description: 'Chain ID' })
    @IsNotEmpty()
    @IsNumber()
    chainId: number
}