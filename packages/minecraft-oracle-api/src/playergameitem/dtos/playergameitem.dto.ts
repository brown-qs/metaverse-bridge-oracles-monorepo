import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SortDirection } from "../../common/enums/SortDirection";

export class SetPlayerGameItemDto {
    @ApiProperty({ description: 'Game ID'})
    gameId: string

    @ApiProperty({ description: 'Item ID'})
    itemId: string

    @ApiProperty({ description: 'Player UUID the tem belongs to'})
    playerId: string

    @ApiProperty({ description: 'Description of the item'})
    amount: string;

    @ApiProperty({ description: 'Timestamp the item was assigned'})
    updatedAt: string;
}

export class QueryGameItemsDto {

    @ApiProperty({ description: 'Game id' })
    gameId: string;

    @ApiProperty({ description: 'Item id' })
    itemId: string;
  
    @ApiPropertyOptional({ description: 'Page Number for pagination, starting at 1' })
    page?: number;
  
    @ApiPropertyOptional({ description: 'Limit how many entries returned. Default is 50' })
    limit?: number;
    
    @ApiPropertyOptional({ description: 'Search by user name. Defaults to all users.' })
    search?: string;
  
    @ApiPropertyOptional({ description: 'Specify column to be sorted. Defaults to amount. Score | Name' })
    sortBy?: string;
  
    @ApiPropertyOptional({ description: 'Sort Direction. DESC | ASC', enum: SortDirection })
    sort?: SortDirection;
}

export class QueryPlayerGameItemsDto {

    @ApiProperty({ description: 'Game ID the item belongs to' })
    gameId: string;

    @ApiProperty({ description: 'Player ID the item belongs to' })
    uuid: string;
}

export class PlayerGameItemsDto {

    @ApiProperty({ description: 'Item ID'})
    itemId: string

    @ApiProperty({ description: 'Item amount as string'})
    amount: string;

    @ApiProperty({ description: 'Timestamp the item was assigned'})
    updatedAt: string;
}

