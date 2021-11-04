import {
    IsBoolean,
    IsNumber,
    IsString,
} from 'class-validator';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column()
    @IsString()
    identifier?: string;

    @ManyToOne(() => UserEntity, (player) => player.playSessions)
    player: UserEntity
}
