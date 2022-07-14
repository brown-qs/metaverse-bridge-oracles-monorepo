import {
    IsBoolean,
    IsNumber,
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { UserEntity } from '../user/user/user.entity';

@Entity()
export class PlayerAchievementEntity {

    constructor(entity: Partial<PlayerAchievementEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
    game: GameEntity;

    @ManyToOne(() => AchievementEntity, (achievement) => achievement.playerAchievements)
    achievement: AchievementEntity;

    @ManyToOne(() => UserEntity, (user) => user.achievements)
    player: UserEntity;

    @Column({default: false})
    @IsBoolean()
    done: boolean;

    @Column({ type: 'bigint' })
    @IsString()
    updatedAt: string;

    @Column({default: 0})
    @IsNumber()
    progress: number;
}
