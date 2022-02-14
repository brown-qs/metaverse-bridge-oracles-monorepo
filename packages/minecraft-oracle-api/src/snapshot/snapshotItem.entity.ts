import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MaterialEntity } from '../material/material.entity';
import { GameEntity } from '../game/game.entity';

@Entity()
@Index(['id'], {unique: true})
export class SnapshotItemEntity {

    constructor(snapshotItem: Partial<SnapshotItemEntity>) {
        Object.assign(this, snapshotItem);
    }

    @PrimaryColumn()
    id: string; // convention:: {user uuid}-{materialName}

    @Column()
    amount: string;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snapshotItems)
    owner: UserEntity;

    @ManyToOne(() => GameEntity, (game) => game.snapshots)
    game?: GameEntity;
}
