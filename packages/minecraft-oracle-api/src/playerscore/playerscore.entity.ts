import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

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

    @ManyToOne(() => UserEntity, (user) => user.achievements)
    player: UserEntity;

    @Column({ type: 'bigint' })
    @IsString()
    updatedAt: string;

    @Column({ type: 'bigint' })
    @IsString()
    score: string;

}
