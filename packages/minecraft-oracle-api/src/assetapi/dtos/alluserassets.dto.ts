import { ApiProperty } from "@nestjs/swagger"
import { AssetEntity } from "../../asset/asset.entity"

export class AllUserAssetsQueryDto {

    @ApiProperty({ description: 'Pagination take. Number of users queried.', default: 100 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number
}

export class UserEntryDto {

    @ApiProperty({ description: 'User name the assets belong to.' })
    name: string

    @ApiProperty({ description: 'User uuid the assets belong to. Trimmed.' })
    uuid: string
}

class AssetEntryDto {

    @ApiProperty({ description: 'Active assets of the user', isArray: true })
    assets: AssetEntity[]

    @ApiProperty({ description: 'User info the assets belong to' })
    user: UserEntryDto
}

export class AllUserAssetsResultDto {

    @ApiProperty({ description: 'Results array', isArray: true, type: AssetEntryDto })
    results: AssetEntryDto[]
}