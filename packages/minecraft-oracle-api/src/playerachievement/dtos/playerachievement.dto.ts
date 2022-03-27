import { ApiProperty } from "@nestjs/swagger";

export class PlayerAchievementDto {
    
    @ApiProperty({ description: 'Id of the player achievement'})
    achievementId: string

    @ApiProperty({ description: 'When the acheivement was awarded. Unix timestamp'})
    updatedAt: string

    @ApiProperty({ description: 'Progress, relates to step field of the achievement.'})
    progress: number

    @ApiProperty({ description: 'Is the achievement completed or not'})
    done: boolean
}

export class SetPlayerAchievementsDto {

    @ApiProperty({ description: 'Player achievements', type: [PlayerAchievementDto]})
    playerAchievements: PlayerAchievementDto[]
}
