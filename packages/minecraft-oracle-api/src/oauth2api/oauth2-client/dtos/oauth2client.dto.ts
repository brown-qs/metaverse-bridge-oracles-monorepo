import { ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, Min } from "class-validator"
import { Oauth2Scope } from "src/common/enums/Oauth2Scope"

export class Oauth2ClientDto {
    @ApiResponseProperty()
    clientId: string

    @ApiResponseProperty()
    clientSecret: string

    @ApiResponseProperty()
    appName: string

    @ApiResponseProperty()
    redirectUri: string

    @ApiResponseProperty()
    accessTokenValidity: number

    @ApiResponseProperty()
    refreshTokenValidity: number

    @ApiResponseProperty()
    scopes: Oauth2Scope[]
}
