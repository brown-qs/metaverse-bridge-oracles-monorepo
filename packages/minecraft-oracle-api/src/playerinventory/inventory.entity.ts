import {
    IsBoolean,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user/user.entity';
import { MaterialEntity } from '../material/material.entity';

@Entity()
@Index(['id'], {unique: true})
export class InventoryEntity {

    constructor(item: Partial<InventoryEntity>) {
        Object.assign(this, item);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column()
    @IsString()
    amount: string;

    @Column()
    @IsBoolean()
    summonable: boolean;
    
    @Column({default: false})
    @IsBoolean()
    summonInProgress?: boolean;
    
    @ManyToOne(() => MaterialEntity, (material) => material.inventoryItems)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.inventoryItems)
    owner: UserEntity;
}
