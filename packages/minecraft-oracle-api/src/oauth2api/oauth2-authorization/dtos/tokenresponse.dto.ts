import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export class TokenResponseDto {
    @ApiProperty({ description: 'access_token', example: "9021ca9bb7160f8eca4402a666286be3" })
    access_token: string

    @ApiProperty({ description: 'token_type always "bearer"', example: "bearer" })
    token_type: string

    @ApiProperty({ description: 'expires_in time in ms access_token token expires in. Value set by client app', example: 3600 })
    expires_in: number

    @ApiProperty({ description: 'refresh_token', example: "38dacf7923012fe91db32a9cbf6d4862" })
    refresh_token: string

    @ApiProperty({ description: 'expires_in time in ms access_token token expires in. Value set by client app', example: 1209600 })
    refresh_token_expires_in: number
}
