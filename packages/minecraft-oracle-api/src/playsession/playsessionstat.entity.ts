import {
    IsString,
} from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { PlaySessionEntity } from './playsession.entity';

@Entity()
@Index(['id'], {unique: true})
export class PlaySessionStatEntity {

    constructor(stat: Partial<PlaySessionStatEntity>) {
        Object.assign(this, stat);
    }

    @PrimaryColumn()
    @IsString()
    id: string;

    @Column({type: "bigint", default: '0'})
    @IsString()
    timePlayed?: string;

    @OneToMany(() => PlaySessionEntity, (session) => session.stat)
    sessions?: PlaySessionEntity[]
}
