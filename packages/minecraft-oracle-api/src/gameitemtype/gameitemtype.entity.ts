import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class GameItemTypeEntity {

    constructor(entity: Partial<GameItemTypeEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
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
