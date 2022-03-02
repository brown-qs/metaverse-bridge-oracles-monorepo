import { ApiProperty } from "@nestjs/swagger";

export class SetPlayerGameItemDto {
    @ApiProperty({ description: 'Game Id'})
    gameId: string

    @ApiProperty({ description: 'Item Id'})
    itemId: string

    @ApiProperty({ description: 'Playe UUId'})
    playerId: string

    @ApiProperty({ description: 'Description of the Item'})
    amount: string;

    @ApiProperty({ description: 'Image of the Item as string'})
    updatedAt: string;
}
