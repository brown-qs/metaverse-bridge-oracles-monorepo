import { ApiProperty } from "@nestjs/swagger";

export class ResourceInventoryQueryResult {

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string

    @ApiProperty({ description: 'Asset id'})
    assetId: string

    @ApiProperty({ description: 'Chain id'})
    chainId: number

    @ApiProperty({ description: 'Amount'})
    amount: string
}

export class ResourceInventory {

    @ApiProperty({ description: 'Asset address'})
    assetAddress: string

    @ApiProperty({ description: 'Asset id'})
    assetId: string

    @ApiProperty({ description: 'Chain id'})
    chainId: number

    @ApiProperty({ description: 'Amount'})
    amount: string
}

export class SetResourceInventoryItems {

    @ApiProperty({ description: 'items', isArray: true, type: ResourceInventory})
    items: ResourceInventory[]
}