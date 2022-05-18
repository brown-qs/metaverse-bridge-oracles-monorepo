import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { StringAssetType } from "../../common/enums/AssetType"

export class ChainAssetDto {

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string
    
    @ApiProperty({ description: 'Asset Id, aka token Id. 0 for erc20 or native token'})
    assetId: string

    @ApiProperty({ description: 'Asset type integer. 0: none, 1: native, 2: erc20, 3: erc721, 4: erc1155', enum: StringAssetType})
    assetType: StringAssetType

    @ApiPropertyOptional({ description: 'Chain ID', default: 1285})
    chainId?: number
}
