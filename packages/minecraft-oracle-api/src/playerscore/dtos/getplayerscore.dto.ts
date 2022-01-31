import { ApiProperty } from "@nestjs/swagger";

export class GetPlayerScoreDto {

    @ApiProperty({ description: 'User uuid'})
    uuid: string;

    @ApiProperty({ description: 'The game id of the score'})
    gameId: string;
}
