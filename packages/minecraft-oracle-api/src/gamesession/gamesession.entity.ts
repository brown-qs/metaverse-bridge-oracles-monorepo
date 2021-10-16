import {
    IsBoolean,
    IsNumber,
    IsString,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameSessionEntity {

    constructor(gameSession: Partial<GameSessionEntity>) {
        Object.assign(this, gameSession);
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

    @Column({ nullable: true })
    @IsBoolean()
    ongoing: boolean;
}
