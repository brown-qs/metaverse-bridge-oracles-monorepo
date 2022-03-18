import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameItemTypeEntity {

    constructor(entity: Partial<GameItemTypeEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => GameEntity, (game) => game.gameItemTypes)
    game: GameEntity;

    @Column()
    @IsString()
    itemId: string;

    @Column()
    @IsString()
    name: string;

    @Column({ nullable: true })
    @IsString()
    description?: string;

    @Column({ nullable: true })
    @IsString()
    image?: string;
}
