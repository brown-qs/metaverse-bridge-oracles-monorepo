import { ApiProperty } from "@nestjs/swagger";

export class ResourceInventoryOffsetQueryResult {

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string

    @ApiProperty({ description: 'Asset id'})
    assetId: string

    @ApiProperty({ description: 'Chain id'})
    chainId: number

    @ApiProperty({ description: 'Amount'})
    amount: string
}

export class ResourceInventoryOffset {

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string

    @ApiProperty({ description: 'Asset id'})
    assetId: string

    @ApiProperty({ description: 'Chain id'})
    chainId: number

    @ApiProperty({ description: 'Amount'})
    amount: string
}

export class SetResourceInventoryOffsetItems {

    @ApiProperty({ description: 'items', isArray: true, type: ResourceInventoryOffset})
    items: ResourceInventoryOffset[]
}