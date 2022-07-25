import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, Length, Min } from "class-validator"

export class UserUpdatesDto {
    @ApiPropertyOptional({ description: 'number of results' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    take?: string

    @ApiPropertyOptional({ description: 'offset, WARNING output could be inconsistent between pages, it is recommended to fetch the full array without offset or limit' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    offset?: string

    @ApiProperty({ description: 'string int in seconds since epoch, equivalent to String(new Date().getTime()/1000)' })
    @IsNotEmpty()
    @Length(10, 10)
    @IsNumberString()
    t: string
}
