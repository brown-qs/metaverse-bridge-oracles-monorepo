import { ApiProperty } from "@nestjs/swagger"
import { GameKind } from "../../game/game.enum"

export class GameKindInProgressDto {
    
    @ApiProperty({ description: 'Kind of game that we check. Default: CARNAGE', enum: GameKind})
    kind?: GameKind
}
