import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEthereumAddress, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumberString, IsObject, IsString, ValidateNested } from "class-validator"
import { Type } from 'class-transformer';
import { InRequestDto } from "../../oracleapi/dtos/index.dto"

export class UpdateMetadataDto {
    @ApiProperty({ description: 'Hash of staked item', required: true })
    @IsNotEmpty()
    @IsString()
    hash: string
}


export class RecoverAssetDto {
    @ApiProperty({ description: 'Hash of staked item', required: true })
    @IsNotEmpty()
    @IsString()
    hash: string

    @ApiProperty({ description: 'Salt of staked item', required: true })
    @IsNotEmpty()
    @IsString()
    salt: string

    @ApiProperty({ description: 'Uuid of staker', required: true })
    @IsNotEmpty()
    @IsString()
    uuid: string

    @ApiProperty({ description: 'InRequestDto of staked item', required: true })
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => InRequestDto)
    inData: InRequestDto
}