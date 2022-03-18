import { GameEntity } from '../game/game.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PlaySessionEntity } from './playsession.entity';

@Entity()
@Index(['id'], {unique: true})
export class PlaySessionStatEntity {

    constructor(stat: Partial<PlaySessionStatEntity>) {
        Object.assign(this, stat);
    }

    @PrimaryColumn()
    id: string;

    @Column({type: "bigint", default: '0'})
    timePlayed?: string;

    @Column({default: 0})
    power?: number;

    @OneToMany(() => PlaySessionEntity, (session) => session.stat)
    sessions?: PlaySessionEntity[]

    @ManyToOne(() => GameEntity, (game) => game.playSessionStats)
    game?: GameEntity
}
