import {
    IsBoolean,
    IsInt,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MaterialEntity } from '../material/material.entity';

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

    @Column({default: false})
    @IsBoolean()
    summonInProgress: boolean;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snapshotItems)
    owner: UserEntity;
}
