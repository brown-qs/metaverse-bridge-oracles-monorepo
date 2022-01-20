import { ApiProperty } from "@nestjs/swagger";
import { AchievementType } from "../achievementType.enum";

export class AchievementDto {

    @ApiProperty({ description: 'Unique ID of the leaderboard'})
    id: string

    @ApiProperty({ description: 'Unique key of the achievement'})
    key: string;

    @ApiProperty({ description: 'Title of the achievement'})
    title: string;

    @ApiProperty({ description: 'Description of the achievement'})
    description: string;

    @ApiProperty({ description: 'Type of the achievement'})
    type: AchievementType;

    @ApiProperty({ description: 'Icon of the achievement'})
    icon: string;

    @ApiProperty({ description: 'How many steps the achievement has'})
    steps: number;
}

export class SetAchievementsDto {

    @ApiProperty({ description: 'Achievements '})
    achievements: AchievementDto[]

    @ApiProperty({ description: 'Game ID the achievement belongs to'})
    gameId: string;
}
