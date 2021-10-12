import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { AssetType } from 'src/common/enums/AssetType';
import { SnapshotItemEntity } from 'src/snapshot/snapshotItem.entity';

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
    @IsEnum(AssetType)
    @Column({
        type: 'enum',
        enum: AssetType,
        default: AssetType.NONE
    })
    assetType: AssetType;

    @Column()
    @IsString()
    assetAddress: string;

    @Column()
    @IsString()
    assetId: string;

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

    @OneToMany(() => SnapshotItemEntity, (snapshotItem) => snapshotItem.material )
    snapshots: SnapshotItemEntity[];
}
