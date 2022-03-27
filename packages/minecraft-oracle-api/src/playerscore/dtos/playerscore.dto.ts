import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SortDirection } from "../../common/enums/SortDirection";

export class SetPlayerScoreDto {

    @ApiProperty({ description: 'Updated at UNIX timestamp'})
    updatedAt: string;

    @ApiProperty({ description: 'The score as a number string'})
    score: number;

    @ApiProperty({ description: 'User uuid'})
    uuid: string;

    @ApiProperty({ description: 'The id of this Score'})
    scoreId: string;
}

export class SetPlayerScoresDto {

    @ApiProperty({ description: 'Player scores'})
    playerScores: SetPlayerScoreDto[];
}

export class QueryPlayerScoreDto {

    @ApiProperty({ description: 'User uuid'})
    uuid: string;

    @ApiProperty({ description: 'The game id of the score'})
    gameId: string;
}

export class QueryPlayerScoresDto {
  
    @ApiPropertyOptional({ description: 'Page Number for pagination, starting at 1' })
    page?: number;
  
    @ApiPropertyOptional({ description: 'Limit how many entries returned. Default is 50' })
    limit?: number;
  
    @ApiPropertyOptional({ description: 'Specify column to be sorted. Score | Name' })
    sortBy?: string;
  
    @ApiPropertyOptional({ description: 'Sort Direction. DESC | ASC. Defaults to DESC.' , enum: SortDirection})
    sort?: SortDirection;
  
    @ApiPropertyOptional({ description: 'Search User Name' })
    search?: string;
  }