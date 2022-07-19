import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsAlphanumeric, IsDefined, IsInt, IsNotEmpty, isNumber, IsNumber, IsNumberString, isNumberString, IsOptional, Length, Min } from "class-validator"
import { AssetEntity } from "../../asset/asset.entity"
import { StringAssetType } from "../../common/enums/AssetType"
import { UserRole } from "../../common/enums/UserRole"
import { PlayEligibilityReason } from "../../config/constants"
import { PlayerSkinDto } from "../../gameapi/dtos/texturemap.dto"
import { ProfileDto } from "../../profileapi/dtos/profile.dto"
import { TextureType } from "../../texture/texturetype.enum"
import { FungibleBalanceEntryDto } from "./fungiblebalances.dto"

export class UserDataDto {
    @ApiProperty()
    uuid: string

    @ApiProperty()
    minecraftUuid: string

    @ApiProperty()
    profile: ProfileDto

    @ApiProperty({ isArray: true, type: PlayerSkinDto })
    skins: PlayerSkinDto[]

    @ApiProperty({ isArray: true, type: AssetEntity })
    assets: AssetEntity[]

    @ApiProperty()
    balances: FungibleBalanceEntryDto
}

