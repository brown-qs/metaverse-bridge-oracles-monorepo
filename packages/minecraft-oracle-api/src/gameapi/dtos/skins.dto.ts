import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt } from "class-validator"


export class SkinRequestDto {
    @ApiProperty({ description: 'Whether to fetch skins that are on auction only'})
    auctionOnly: boolean
}

