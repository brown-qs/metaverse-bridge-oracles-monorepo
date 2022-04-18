import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber } from "class-validator"

export class ConfirmDto {
    @ApiProperty({ description: 'Meta asset hash in the metaverse contract'})
    @IsString()
    hash: string

    @ApiProperty({ description: 'Chain ID'})
    @IsNumber()
    chainId: number
}
