import { ApiProperty } from "@nestjs/swagger";

export class SetGameItemTypeDto {

    @ApiProperty({ description: 'Item Id'})
    itemId: string

    @ApiProperty({ description: 'Item Name'})
    name: string;

    @ApiProperty({ description: 'Description of the item'})
    description?: string;

    @ApiProperty({ description: 'Image of the Item as string'})
    image?: string;
}

export class QueryGameItemTypesDto {

    @ApiProperty({ description: 'Game ID the items belong to'})
    gameId: string
}


export class GameItemTypeDto {

    @ApiProperty({ description: 'Item name'})
    name: string;

    @ApiProperty({ description: 'Description of the item'})
    description?: string;

    @ApiProperty({ description: 'Image of the game item as string'})
    image?: string;
}
