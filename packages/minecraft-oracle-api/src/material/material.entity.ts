import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { InventoryEntity } from '../playerinventory/inventory.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';

@Entity()
@Index(['name'], {unique: true})
export class MaterialEntity {

    constructor(material: Partial<MaterialEntity>) {
        Object.assign(this, material);
    }

    @PrimaryColumn()
    @IsString()
    name: string;

    @Column()
    @IsString()
    assetId: string;

    @IsNumber()
    @Column({default: 1, nullable: false})
    multiplier?: number;

    @IsBoolean()
    @Column()
    snapshottable: boolean;

    @IsBoolean()
    @Column()
    equippable: boolean;

    @OneToMany(() => SnapshotItemEntity, (snapshotItem) => snapshotItem.material )
    snapshots?: SnapshotItemEntity[];

    @OneToMany(() => SnaplogEntity, (snaplog) => snaplog.material )
    snaplogs?: SnaplogEntity[];

    @OneToMany(() => InventoryEntity, (ie) => ie.material )
    inventoryItems?: InventoryEntity[];

    @ManyToOne(() => CollectionFragmentEntity, (fragment) => fragment.materials)
    collectionFragment: CollectionFragmentEntity;
}
