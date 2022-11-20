import {
    IsDate,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, OneToOne, PrimaryColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceInventoryEntity } from '../resourceinventory/resourceinventory.entity';

@Entity()
export class ResourceInventoryOffsetEntity {

    constructor(item: Partial<ResourceInventoryOffsetEntity>) {
        Object.assign(this, item);
    }

    @PrimaryGeneratedColumn()
    @IsNumber()
    id?: number; // convention:: {user uuid}-{materialName}

    @Column({ nullable: true, default: '0' })
    @IsString()
    amount: string;

    @Column({ type: "timestamptz", nullable: true, default: new Date() })
    @IsDate()
    at: Date

    @Column({ nullable: true, default: null })
    @IsString()
    note: string;

    //we need cascade update here because user migrations change the id of ResourceInventoryEntity because it contains uuid
    @ManyToOne(() => ResourceInventoryEntity, (rie) => rie.offsets, { onUpdate: "CASCADE" })
    resourceInventory: ResourceInventoryEntity;
}
