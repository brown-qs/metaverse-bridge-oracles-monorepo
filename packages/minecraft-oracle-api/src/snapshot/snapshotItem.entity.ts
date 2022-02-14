import {
    IsBoolean,
    IsInt,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MaterialEntity } from '../material/material.entity';
import { GameEntity } from 'src/game/game.entity';

@Entity()
@Index(['id'], {unique: true})
export class SnapshotItemEntity {

    constructor(snapshotItem: Partial<SnapshotItemEntity>) {
        Object.assign(this, snapshotItem);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column()
    @IsString()
    amount: string;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snapshotItems)
    owner: UserEntity;

    @ManyToOne(() => GameEntity, (game) => game.snapshots)
    game?: GameEntity;
}
