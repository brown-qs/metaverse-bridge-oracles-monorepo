import {
    IsString,
    IsNumber
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class GameScoreTypeEntity {

    constructor(entity: Partial<GameScoreTypeEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @ManyToOne(() => GameEntity)
    game: GameEntity;

    @Column()
    @IsString()
    scoreId: string;

    @Column()
    @IsString()
    name: string;

    @Column({ nullable: true })
    @IsString()
    description?: string;

    @Column({ nullable: true })
    @IsString()
    image?: string;

    @Column()
    @IsNumber()
    column: number;
}
