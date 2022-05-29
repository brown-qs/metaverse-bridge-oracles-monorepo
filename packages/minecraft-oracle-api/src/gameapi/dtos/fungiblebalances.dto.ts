import { ApiProperty } from "@nestjs/swagger"

export class FungibleBalanceDto {

    @ApiProperty({ description: 'Asset address' })
    assetAddress: string

    @ApiProperty({ description: 'Asset id' })
    assetId: string

    @ApiProperty({ description: 'Chain id' })
    chainId: number

    @ApiProperty({ description: 'Amount' })
    amount: string
}

export class GetFungibleBalancesResultDto {

    @ApiProperty({ description: 'Balances', isArray: true, type: FungibleBalanceDto })
    balances: FungibleBalanceDto[]

    @ApiProperty({ description: 'User trimmed uuid' })
    uuid: string
}