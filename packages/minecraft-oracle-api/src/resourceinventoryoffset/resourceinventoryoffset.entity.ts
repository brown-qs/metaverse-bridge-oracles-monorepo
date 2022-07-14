import {
    IsString
} from 'class-validator';
import { Column, Entity, Index, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { ResourceInventoryEntity } from '../resourceinventory/resourceinventory.entity';

@Entity()
@Index(['id'], { unique: true })
export class ResourceInventoryOffsetEntity {

    constructor(item: Partial<ResourceInventoryOffsetEntity>) {
        Object.assign(this, item);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column({ nullable: true, default: '0' })
    @IsString()
    amount: string;

    //we need cascade update here because user migrations change the id of ResourceInventoryEntity because it contains uuid
    @OneToOne(() => ResourceInventoryEntity, (rie) => rie.offset, { onUpdate: "CASCADE" })
    @JoinColumn()
    resourceInventory: ResourceInventoryEntity;
}
