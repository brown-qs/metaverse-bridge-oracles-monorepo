import { ApiProperty } from "@nestjs/swagger";
import { AchievementType } from "../achievementType.enum";

export class AchievementDto {

    @ApiProperty({ description: 'Unique ID of the achievement'})
    id: string

    @ApiProperty({ description: 'Title of the achievement'})
    title: string;

    @ApiProperty({ description: 'Description of the achievement'})
    description: string;

    @ApiProperty({ description: 'Type of the achievement', enum: AchievementType})
    type: AchievementType;

    @ApiProperty({ description: 'Icon of the achievement'})
    icon: string;

    @ApiProperty({ description: 'How many steps the achievement has'})
    steps: number;
}

export class SetAchievementsDto {

    @ApiProperty({ description: 'Achievements ', type: [AchievementDto]})
    achievements: AchievementDto[]
}

export class GetAchievementsDto {

    @ApiProperty({ description: 'Game ID the achievements belong to'})
    gameId: string;
}
