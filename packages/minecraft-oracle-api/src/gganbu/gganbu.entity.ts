import {
    IsString,
} from 'class-validator';
import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MaterialEntity } from '../material/material.entity';

@Entity()
export class GganbuEntity {

    constructor(entity: Partial<GganbuEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    @IsString()
    id: string; // convention:: materialName

    @Column()
    @IsString()
    amount: string;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => GameEntity, (game) => game.gganbus)
    game?: GameEntity;
}
