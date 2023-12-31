import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GameKind } from "../game.enum";

export class SetGameDto {
    @ApiProperty({ description: 'Name of the game'})
    name?: string

    @ApiProperty({ description: 'Description of the game'})
    description?: string;

    @ApiProperty({ description: 'Image of the game as string'})
    image?: string;

    @ApiProperty({ description: 'Whether the game is ongoing/active or not'})
    ongoing?: boolean;

    @ApiProperty({ description: 'Game kind. ADVANCEMENTS, SCOREBOARD, CARNAGE', enum: GameKind})
    type: GameKind;

    @ApiProperty({ description: 'Game type ID this game belongs to'})
    gameTypeId: string
}

export class FetchGameDto {

    @ApiPropertyOptional({ description: 'Filter results by game type id. Default: query all games'})
    gameTypeId?: string
}
