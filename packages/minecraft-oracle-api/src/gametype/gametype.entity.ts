import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class GameTypeEntity {

    constructor(entity: Partial<GameTypeEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @Column()
    @IsString()
    ip: string;

    @Column({ nullable: true })
    @IsString()
    name?: string;

    @Column({ nullable: true })
    @IsString()
    description?: string;

    @Column({ nullable: true })
    @IsString()
    image?: string;

    @OneToMany(() => GameEntity, (game) => game.gameType)
    games?: GameEntity[];
}
