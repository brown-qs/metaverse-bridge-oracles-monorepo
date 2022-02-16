import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { InventoryEntity } from '../playerinventory/inventory.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { StringAssetType } from '../common/enums/AssetType';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';

@Entity()
@Index(['name'], {unique: true})
export class MaterialEntity {

    constructor(material: Partial<MaterialEntity>) {
        Object.assign(this, material);
    }

    @PrimaryColumn()
    @IsString()
    name: string;

    @Column({unique: true})
    @IsString()
    key: string;

    @Column()
    @IsNumber()
    hashCode: number;

    @Column({unique: true})
    @IsNumber()
    ordinal: number;

    @IsNumber()
    @Column()
    maxStackSize: number;

    @Column()
    @IsEnum(StringAssetType)
    @Column({
        type: 'enum',
        enum: StringAssetType,
        default: StringAssetType.NONE
    })
    assetType: StringAssetType;

    @Column()
    @IsString()
    assetAddress: string;

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
    importable: boolean;

    @IsBoolean()
    @Column()
    exportable: boolean;

    @IsBoolean()
    @Column()
    equippable: boolean;

    @IsString()
    @Column({nullable: true})
    mapsTo?: string;

    @OneToMany(() => SnapshotItemEntity, (snapshotItem) => snapshotItem.material )
    snapshots?: SnapshotItemEntity[];

    @OneToMany(() => SnaplogEntity, (snaplog) => snaplog.material )
    snaplogs?: SnaplogEntity[];

    @OneToMany(() => InventoryEntity, (iitem) => iitem.material )
    inventoryItems?: InventoryEntity[];
}
