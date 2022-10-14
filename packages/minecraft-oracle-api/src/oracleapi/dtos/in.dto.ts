import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"
import { AssetDto } from "./asset.dto"

export class InDto {
    @ApiProperty({ description: 'Asset to import', type: AssetDto })
    asset: AssetDto

    @ApiProperty({ description: 'Owner of the asset' })
    @IsString()
    owner: string

    @ApiProperty({ description: 'Amount to import in wei' })
    @IsString()
    amount: string

    @ApiProperty({ description: 'Chain ID' })
    @IsNumber()
    chainId: number
}
