import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GamerTagDto {

    @ApiProperty({ description: 'Gamer tag' })
    @IsString()
    @IsNotEmpty()
    gamerTag: string

}
