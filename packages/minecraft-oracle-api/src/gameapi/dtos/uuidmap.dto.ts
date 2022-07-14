import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, Min } from "class-validator"

export class UuidMapDto {
    @ApiPropertyOptional({ description: 'number of results WARNING: results are sorted by minecraftUuid, if minecraft users are added output will be inconsistent' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    limit?: string

    @ApiPropertyOptional({ description: 'offset WARNING: results are sorted by minecraftUuid, if minecraft users are added output will be inconsistent' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    offset?: string

    @ApiPropertyOptional({ description: 'Only return a map for these minecraft uuids' })
    @IsOptional()
    @IsNotEmpty({ each: true })
    @IsAlphanumeric("en-US", { each: true })
    minecraftUuids?: string[]
}
