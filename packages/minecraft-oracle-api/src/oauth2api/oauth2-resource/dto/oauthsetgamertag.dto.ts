import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export class OauthSetGamerTagDto {
    @ApiProperty({ description: 'user gamer tag', example: "filthyn00b" })
    gamerTag: string
}
