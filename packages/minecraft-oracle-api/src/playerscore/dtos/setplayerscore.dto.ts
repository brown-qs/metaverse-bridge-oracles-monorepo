import { ApiProperty } from "@nestjs/swagger";

export class SetPlayerScoreDto {

    @ApiProperty({ description: 'Unique key of the score'})
    key: string;

    @ApiProperty({ description: 'Updated at UNIX timestamp'})
    updatedAt: string;

    @ApiProperty({ description: 'The score as a number string'})
    score: number;

    @ApiProperty({ description: 'The score as a number string'})
    uuid: string;

    @ApiProperty({ description: 'The game id of the score'})
    gameId: string;
}
