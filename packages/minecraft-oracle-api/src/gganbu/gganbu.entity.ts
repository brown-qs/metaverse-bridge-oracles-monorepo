import { GameEntity } from '../game/game.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MaterialEntity } from '../material/material.entity';

@Entity()
export class GganbuEntity {

    constructor(entity: Partial<GganbuEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({ unique: true })
    id: string; // convention:: materialName-gameId

    @Column()
    amount: string;

    @Column({ default: 0 })
    powerSum?: number;

    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => GameEntity, (game) => game.gganbus)
    game?: GameEntity;
}
