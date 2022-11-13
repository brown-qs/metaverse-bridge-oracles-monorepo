import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayUnique, IsAlphanumeric, IsAscii, IsDefined, IsEnum, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, IsUrl, MaxLength, Min } from "class-validator"
import { Oauth2Scope } from "../../../common/enums/Oauth2Scope"

export class Oauth2CreateClientDto {
    @ApiProperty({ description: 'Name of your OAuth 2.0 client' })
    @IsNotEmpty()
    @IsString()
    @IsAscii()
    @MaxLength(30)
    appName: string

    @ApiProperty({ description: 'Redirect Uri of your OAuth 2.0 client' })
    @IsNotEmpty()
    @IsUrl({ require_tld: false })
    redirectUri: string

    @ApiProperty({ description: 'Broadest scopes your OAuth 2.0 client will be allowed to access. For individual users can request lesser scopes.', example: [Oauth2Scope.UserGamerTagRead, Oauth2Scope.UserUuidRead] })
    @ArrayUnique()
    @IsNotEmpty({ each: true })
    @IsEnum(Oauth2Scope, { each: true })
    scopes: Oauth2Scope[]
}
