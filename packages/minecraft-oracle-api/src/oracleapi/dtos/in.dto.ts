import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { AssetType, StringAssetType } from "../../common/enums/AssetType"
import { AssetDto } from "./asset.dto"

export class InDto {
    @ApiProperty({ description: 'Chain ID' })
    @IsNotEmpty()
    @IsNumber()
    chainId: number

    @ApiProperty({ description: 'Asset type integer. 0: none, 1: native, 2: erc20, 3: erc721, 4: erc1155', enum: StringAssetType })
    @IsNotEmpty()
    @IsEnum(StringAssetType)
    assetType: StringAssetType

    @ApiProperty({ description: 'Asset address' })
    @IsNotEmpty()
    @IsEthereumAddress()
    assetAddress: string

    @ApiProperty({ description: 'Asset Id, aka token Id. 0 for erc20 or native token' })
    @IsNotEmpty()
    @IsNumber()
    assetId: number

    @ApiProperty({ description: 'Owner of the asset' })
    @IsNotEmpty()
    @IsEthereumAddress()
    owner: string

    @ApiProperty({ description: 'Amount to import in wei' })
    @IsNotEmpty()
    @IsString()
    amount: string

    @ApiProperty({ description: 'Included for future flexibility if we give user a choice. But still enforced now.' })
    @IsNotEmpty()
    @IsBoolean()
    enrapture: string
}
