import { ApiProperty } from "@nestjs/swagger"
import { IsAlphanumeric, IsDefined, IsEthereumAddress, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumberString, IsObject, IsString, ValidateNested } from "class-validator"
import { Type } from 'class-transformer';
import { InRequestDto } from "../../oracleapi/dtos/index.dto"

export class UpdateMetadataDto {
    @ApiProperty({ description: 'Hash of staked item', required: true })
    @IsNotEmpty()
    @IsString()
    hash: string
}

export class BlacklistUserRequestDto {
    @ApiProperty({ description: 'User to take action on.', required: true, example: "664921ff10ef7c8ecfb48ada19355999" })
    @IsNotEmpty()
    @IsAlphanumeric()
    @IsString()
    uuid: string

    @ApiProperty({ description: 'Note on user behavior that merited action.', required: true, example: "User cheated at carnage event on 2022-10-16 ..." })
    @IsNotEmpty()
    @IsString()
    note: string
}

export class UnBlacklistUserRequestDto extends BlacklistUserRequestDto { }


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