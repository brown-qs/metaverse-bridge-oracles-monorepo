import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SortDirection } from "../../common/enums/SortDirection";

export class SetPlayerGameItemDto {

    @ApiProperty({ description: 'Item ID'})
    itemId: string

    @ApiProperty({ description: 'Player UUID the player this item belongs to'})
    playerId: string

    @ApiProperty({ description: 'Description of the item'})
    amount: string;

    @ApiProperty({ description: 'Timestamp the item was assigned'})
    updatedAt: string;
}

export class SetPlayerGameItemsDto {

    @ApiProperty({ description: 'Player game items list to set', isArray: true, type: SetPlayerGameItemDto})
    playerGameItems: SetPlayerGameItemDto[]
}


export class QueryGameItemsDto {

    @ApiProperty({ description: 'Item id' })
    itemId: string;
  
    @ApiPropertyOptional({ description: 'Page Number for pagination, starting at 1' })
    page?: number;
  
    @ApiPropertyOptional({ description: 'Limit how many entries returned. Default is 50' })
    limit?: number;
    
    @ApiPropertyOptional({ description: 'Search by user name. Defaults to all users.' })
    search?: string;
  
    @ApiPropertyOptional({ description: 'Specify column to be sorted. Defaults to amount. amount | name' })
    sortBy?: string;
  
    @ApiPropertyOptional({ description: 'Sort direction. DESC | ASC', enum: SortDirection })
    sortDirection?: SortDirection;
}

export class PlayerGameItemsDto {

    @ApiProperty({ description: 'Item ID'})
    itemId: string

    @ApiProperty({ description: 'Item amount as string'})
    amount: string;

    @ApiProperty({ description: 'Timestamp the item was assigned'})
    updatedAt: string;
}

