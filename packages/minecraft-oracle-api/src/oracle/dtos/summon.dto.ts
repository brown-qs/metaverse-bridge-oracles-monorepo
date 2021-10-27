import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class SummonDto {

    @ApiProperty({ description: 'Recipient of the asset'})
    @IsString()
    recipient: string
}
