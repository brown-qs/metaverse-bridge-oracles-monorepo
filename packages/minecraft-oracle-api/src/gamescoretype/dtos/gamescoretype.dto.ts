import { ApiProperty } from "@nestjs/swagger";

export class SetGameScoreTypeDto {

    @ApiProperty({ description: 'Score ID'})
    scoreId: string

    @ApiProperty({ description: 'Name of the score'})
    name: string

    @ApiProperty({ description: 'Description of the game'})
    description?: string;

    @ApiProperty({ description: 'Image of the game as string'})
    image?: string;

    @ApiProperty({ description: 'Column'})
    column: number;
}
