import {
    IsNumber,
    IsString,
} from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlaySessionStatEntity } from './playsessionstat.entity';
import { GameEntity } from 'src/game/game.entity';

@Entity()
export class PlaySessionEntity {

    constructor(playSession: Partial<PlaySessionEntity>) {
        Object.assign(this, playSession);
    }

    @PrimaryGeneratedColumn()
    @IsNumber()
    id?: number;

    @Column({type: "bigint"})
    @IsString()
    startedAt: string;

    @Column({ type: "bigint", nullable: true })
    @IsString()
    endedAt?: string;

    @Column({nullable: true, default: null})
    @IsString()
    identifier?: string;

    @ManyToOne(() => UserEntity, (player) => player.playSessions)
    player: UserEntity

    @ManyToOne(() => PlaySessionStatEntity, (stat) => stat.sessions)
    stat?: PlaySessionStatEntity

    @ManyToOne(() => GameEntity, (game) => game.playSessions)
    game: GameEntity
}
