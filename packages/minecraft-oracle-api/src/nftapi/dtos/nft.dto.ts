import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class NftsQueryDto {

    @ApiProperty({ description: 'Asset IDs being queried'})
    assetIds: string[]

    @ApiPropertyOptional({ description: 'Chain ID', default: 1285})
    chainId?: string

    @ApiProperty({ description: 'Asset type'})
    assetType: string

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string
}

export class CollectionQueryDto {

    @ApiProperty({ description: 'Pagination take. Number of assets queried.', default: 100 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number

    @ApiPropertyOptional({ description: 'Chain ID', default: 1285})
    chainId?: string

    @ApiProperty({ description: 'Asset type'})
    assetType: string

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string
}
