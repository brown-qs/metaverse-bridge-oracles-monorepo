import { ApiProperty } from "@nestjs/swagger";

export class SetGameTypeDto {
    @ApiProperty({ description: 'Name of the game'})
    name?: string

    @ApiProperty({ description: 'Unique ID of the game'})
    id: string

    @ApiProperty({ description: 'IP of the game'})
    ip: string;

    @ApiProperty({ description: 'Description of the game'})
    description?: string;

    @ApiProperty({ description: 'Image of the game as string'})
    image?: string;
}
