import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { AssetType } from "../../common/enums/AssetType"

export class AssetDto {

    @ApiProperty({ description: 'Asset address'})
    @IsString()
    assetAddress: string
    
    @ApiProperty({ description: 'Asset Id, aka token Id. 0 for erc20 or native token'})
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type integer. 0: none, 1: native, 2: erc20, 3: erc721, 4: erc1155', enum: AssetType})
    assetType: AssetType
}
