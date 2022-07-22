import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export class OauthGetUserDto {
    @ApiProperty({ description: 'user uuid', example: "9021ca9bb7160f8eca4402a666286be3" })
    uuid: string

    @ApiProperty({ description: 'user gamer tag', example: "filthyn00b" })
    gamerTag: string | null
}
