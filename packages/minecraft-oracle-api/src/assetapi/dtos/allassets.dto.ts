import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { AssetEntity } from "../../asset/asset.entity"
import { UserEntryDto } from "./alluserassets.dto"

export class AllAssetsQueryDto {

    @ApiProperty({ description: 'Pagination take. Number of assets queried.', default: 1000 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number

    @ApiPropertyOptional({ description: 'Specific asset hashes to query instead of take and offset.'})
    specifics?: string[]
}

export class AllAssetsResultDto {

    @ApiProperty({ description: 'Results array', isArray: true })
    results: (AssetEntity & { owner: UserEntryDto })[]
}
