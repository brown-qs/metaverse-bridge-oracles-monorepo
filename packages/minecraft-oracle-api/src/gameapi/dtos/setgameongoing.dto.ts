import { ApiProperty } from "@nestjs/swagger";

export class SetGameOngoingDto {
    @ApiProperty({ description: 'Sets whether there is an active game in progress.'})
    ongoing: boolean

    @ApiProperty({ description: 'Game identifier'})
    gameId: string
}