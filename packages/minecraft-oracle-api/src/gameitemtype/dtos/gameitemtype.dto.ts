import { ApiProperty } from "@nestjs/swagger";

export class SetGameItemTypeDto {
    @ApiProperty({ description: 'Game Id'})
    gameId: string

    @ApiProperty({ description: 'Item Id'})
    itemId: string

    @ApiProperty({ description: 'Item Name'})
    name: string;

    @ApiProperty({ description: 'Description of the Item'})
    description?: string;

    @ApiProperty({ description: 'Image of the Item as string'})
    image?: string;
}
