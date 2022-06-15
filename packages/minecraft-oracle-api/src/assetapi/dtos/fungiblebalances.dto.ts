import { ApiProperty } from "@nestjs/swagger"
import { UserEntryDto } from "./alluserassets.dto"

export class UsersFungibleBalancesQueryDto {

    @ApiProperty({ description: 'Pagination take. Number of users queried.', default: 100 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number

    @ApiProperty({ description: 'Whether to exclude entries with no balances', default: false })
    excludeEmpty: boolean
}

class FungibleBalanceDto {

    @ApiProperty({ description: 'Asset address' })
    assetAddress: string

    @ApiProperty({ description: 'Asset id' })
    assetId: string

    @ApiProperty({ description: 'Chain id' })
    chainId: number

    @ApiProperty({ description: 'Amount in ether' })
    amount: string
}

export class FungibleBalanceEntryDto {

    @ApiProperty({ description: 'Fungible balances of the user', isArray: true, type: FungibleBalanceDto })
    balances: FungibleBalanceDto[]

    @ApiProperty({ description: 'User info the assets belong to' })
    user: UserEntryDto
}

export class UsersFungibleBalancesResultDto {

    @ApiProperty({ description: 'Results array', isArray: true })
    results: FungibleBalanceEntryDto[]
}
