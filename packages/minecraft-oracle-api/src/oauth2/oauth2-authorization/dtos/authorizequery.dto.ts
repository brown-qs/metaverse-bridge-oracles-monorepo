import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export class AuthorizeQueryDto {
    @ApiProperty({ description: 'should always be code' })
    response_type: string

    //only param to validate, because the rest will use callback urls for errors, unless client not found
    @ApiProperty({ description: 'client_id' })
    @IsNotEmpty()
    @IsAlphanumeric()
    client_id: string

    @ApiPropertyOptional({ description: 'redirection URI using the "application/x-www-form-urlencoded" format, will check against redirect URI authorized by client, included incase later it is decided that a client can have multiple redirect uris. Should be left optional for now' })
    redirect_uri: string

    @ApiPropertyOptional({ description: "Space delimited scopes, if not included will grant all scopes that client is allowed" })
    scope: string

    @ApiPropertyOptional({ description: "RECOMMENDED. An opaque value used by the client to maintain state between the request and callback. The authorization server includes this value when redirecting the user-agent back to the client. The parameter SHOULD be used for preventing cross-site request forgery" })
    state: string
}
