import { ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, Min } from "class-validator"
import { Oauth2Scope } from "src/common/enums/Oauth2Scope"

export class Oauth2PublicClientDto {
    @ApiResponseProperty()
    appName: string

    @ApiResponseProperty()
    scopes: { scope: Oauth2Scope, prettyScope: string }[]
}
