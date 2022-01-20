import {
    IsEnum,
    IsNumber,
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { AchievementType } from './achievementType.enum';
import { PlayerAchievementEntity } from 'src/playerachievement/playerachievement.entity';

@Entity()
export class AchievementEntity {

    constructor(entity: Partial<AchievementEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
    game: GameEntity;

    @OneToMany(() => PlayerAchievementEntity, (playerAchievement) => playerAchievement.achievement)
    playerAchievements?: PlayerAchievementEntity[];

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    description: string;

    @IsEnum(AchievementType)
    @Column({
        type: 'enum',
        enum: AchievementType,
        nullable: false
    })
    type: AchievementType;

    @Column()
    @IsString()
    icon: string;

    @Column()
    @IsNumber()
    steps: number;
}
