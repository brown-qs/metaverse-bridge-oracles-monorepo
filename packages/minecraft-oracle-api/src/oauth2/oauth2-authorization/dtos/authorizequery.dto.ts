import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, IsString, Min } from "class-validator"

export class AuthorizeQueryDto {
    @ApiProperty({ description: 'should always be code' })
    @IsNotEmpty()
    @IsString()
    response_type: string

    @ApiPropertyOptional({ description: 'client_id' })
    @IsNotEmpty()
    @IsAlphanumeric()
    client_id: string

    @ApiPropertyOptional({ description: 'redirection URI using the "application/x-www-form-urlencoded" format' })
    @IsNotEmpty()
    @IsString()
    redirect_uri: string
}
