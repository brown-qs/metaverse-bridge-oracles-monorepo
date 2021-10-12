import {
    IsInt,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { MaterialEntity } from 'src/material/material.entity';

@Entity()
@Index(['id'], {unique: true})
export class SnapshotItemEntity {

    constructor(snapshotItem: Partial<SnapshotItemEntity>) {
        Object.assign(this, snapshotItem);
    }

    @PrimaryGeneratedColumn("uuid")
    @IsString()
    id: string;

    @Column()
    @IsInt()
    amount: number;

    @Column({ nullable: true })
    @IsNumber()
    position: number;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snapshots)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snapshotItems)
    owner: UserEntity;
}
