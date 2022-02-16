import { ApiProperty } from "@nestjs/swagger"


export class SkinRequestDto {
    @ApiProperty({ description: 'Whether to fetch skins that are on auction only'})
    auctionOnly: boolean
}

