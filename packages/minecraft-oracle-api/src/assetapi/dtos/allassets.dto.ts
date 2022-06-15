import { ApiProperty } from "@nestjs/swagger"
import { AssetEntity } from "../../asset/asset.entity"
import { UserEntryDto } from "./alluserassets.dto"

export class AllAssetsQueryDto {

    @ApiProperty({ description: 'Pagination take. Number of assets queried.', default: 1000 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number
}

export class AllAssetsResultDto {

    @ApiProperty({ description: 'Results array', isArray: true })
    results: (AssetEntity & { owner: UserEntryDto })[]
}
