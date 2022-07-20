import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsEnum, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export enum Oauth2GrantTypes {
    AuthorizationCode = "authorization_code",
    RefreshToken = "refresh_token"

}
export class TokenBodyDto {
    @ApiProperty({ description: 'Value MUST be authorization_code OR refresh_token', example: Oauth2GrantTypes.AuthorizationCode })
    @IsNotEmpty()
    @IsEnum(Oauth2GrantTypes)
    grant_type: Oauth2GrantTypes

    @ApiProperty({ description: 'client_id', example: "97969c543b7d0941f58b5f04f7af4d7d" })
    @IsNotEmpty()
    @IsAlphanumeric()
    client_id: string

    @ApiProperty({ description: 'client_secret', example: "97969c543b7d0941f58b5f04f7af4d7d" })
    @IsNotEmpty()
    @IsAlphanumeric()
    client_secret: string

    //START: grant_type authorization_code
    @ApiPropertyOptional({ description: '[Required: grant_type=authorization_code] The authorization code received from the authorization server.', example: "22748016b850059220ac0ccb50f613af" })
    @IsOptional()
    @IsNotEmpty()
    @IsAlphanumeric()
    code: string

    @ApiPropertyOptional({ description: '[Required: grant_type=authorization_code] if the "redirect_uri" parameter was included in the authorization request.', example: "http://localhost:3000/cb" })
    @IsOptional()
    @IsNotEmpty()
    redirect_uri: string
    //END: grant_type authorization_code


    //START: grant_type refresh_token
    @ApiPropertyOptional({ description: '[Required: grant_type=refresh_token]', example: "ac3bc75429e3ed9e92d9044d8bf6a821" })
    @IsOptional()
    @IsNotEmpty()
    refresh_token: string
    //END: grant_type refresh_token

}
