import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class ConfirmDto {
    @ApiProperty({ description: 'Meta asset hash in the metaverse contract'})
    @IsString()
    hash: string
}
