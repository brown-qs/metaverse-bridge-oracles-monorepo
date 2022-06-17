import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';

@Entity()
export class PlayerScoreEntity {

    constructor(entity: Partial<PlayerScoreEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
    game: GameEntity;

    @ManyToOne(() => MinecraftUserEntity, (user) => user.achievements)
    player: MinecraftUserEntity;

    @Column({ type: 'bigint' })
    @IsString()
    updatedAt: string;

    @Column({ type: 'bigint' })
    @IsString()
    score: string;

    @Column()
    @IsString()
    scoreId: string;
}
