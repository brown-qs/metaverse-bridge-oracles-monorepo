import {
    IsBoolean,
    IsNumber,
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';

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

    @ManyToOne(() => MinecraftUserEntity, (user) => user.achievements)
    player: MinecraftUserEntity;

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
