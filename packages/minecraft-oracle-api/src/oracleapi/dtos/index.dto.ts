import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsEnum, IsEthereumAddress, IsString, IsBoolean, ArrayMinSize, IsArray, ValidateNested, IsAlphanumeric, ValidateIf } from "class-validator"
import { StringAssetType } from "../../common/enums/AssetType"
import { TransactionStatus } from "../../config/constants"

export class InRequestDto {
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
    enrapture: boolean
}

export class InBatchRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => InRequestDto)
    requests: InRequestDto[];
}

export class InConfirmRequestDto {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    hash: string
}

export class InConfirmResponseDto {
    @IsNotEmpty()
    @IsBoolean()
    confirmed: boolean
}

export class SwapResponseDto {
    @IsNotEmpty()
    @IsEnum(TransactionStatus)
    transactionStatus: TransactionStatus

    @IsString()
    @ValidateIf((object, value) => value !== null)
    transactionHash: string | null
}




export class OutRequestDto {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    hash: string
}

export class OutBatchRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => OutRequestDto)
    requests: OutRequestDto[];
}

export class OutConfirmRequestDto {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    hash: string
}

export class OutConfirmResponseDto {
    @IsNotEmpty()
    @IsBoolean()
    confirmed: boolean
}