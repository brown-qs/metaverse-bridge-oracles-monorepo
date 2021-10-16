import { ApiProperty } from "@nestjs/swagger";

export class GameInProgressDto {
    @ApiProperty({ description: 'Sets whether there is an active game in progress.'})
    gameInProgress: boolean
}