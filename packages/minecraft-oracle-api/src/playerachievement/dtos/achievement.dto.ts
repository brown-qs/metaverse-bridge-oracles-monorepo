import { ApiProperty } from "@nestjs/swagger";

export class PlayerAchievementDto {
    @ApiProperty({ description: 'Name of the leaderboard'})
    name: string

    @ApiProperty({ description: 'Unique ID of the leaderboard'})
    id: string

    @ApiProperty({ description: 'When the acheivement was awarded. Unix timestamp'})
    awardedAt: string

    @ApiProperty({ description: 'When the acheivement was awarded. Unix timestamp'})
    progress: number

    @ApiProperty({ description: 'Is the achievement completed or not'})
    done: boolean
}

export class GetPlayerAchievementDto {

    @ApiProperty({ description: 'Id of the player achievement'})
    gameId: string

    @ApiProperty({ description: 'Uuid of the player'})
    uuid: string
}

export class SetPlayerAchievementsDto {

    @ApiProperty({ description: 'Id of the player achievement'})
    gameId: string

    @ApiProperty({ description: 'Id of the player achievement'})
    achievementId: string

    @ApiProperty({ description: 'Uuid of the player'})
    uuid: string

    @ApiProperty({ description: 'Player achievements'})
    playerAchievements: PlayerAchievementDto[]
}
