import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecognizedAssetType } from '../config/constants';
import { CollectionEntity } from '../collection/collection.entity';
import { AssetEntity } from '../asset/asset.entity';
import { CompositePartEntity } from '../compositepart/compositepart.entity';
import { ResourceInventoryEntity } from '../resourceinventory/resourceinventory.entity';
import { CollectionFragmentRoutingEntity } from '../collectionfragmentrouting/collectionfragmentrouting.entity';
import { InventoryEntity } from 'src/playerinventory/inventory.entity';
import { MaterialEntity } from '../material/material.entity';


@Entity()
export class CollectionFragmentEntity {

    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @IsEnum(RecognizedAssetType)
    @Column({
        type: 'enum',
        enum: RecognizedAssetType,
        default: RecognizedAssetType.NONE
    })
    recognizedAssetType: RecognizedAssetType;

    @Column({ nullable: true, default: 1 })
    @IsNumber()
    decimals?: number;

    @Column({ nullable: true, default: false })
    @IsBoolean()
    treatAsFungible?: boolean;

    @Column()
    @IsBoolean()
    enrapturable: boolean;

    @Column()
    @IsBoolean()
    importable: boolean;

    @Column()
    @IsBoolean()
    exportable: boolean;

    @Column()
    @IsBoolean()
    summonable: boolean;

    @Column()
    @IsBoolean()
    gamepass: boolean;

    @Column({ default: false })
    @IsBoolean()
    migratable: boolean;

    @Column()
    @IsString()
    name: string;

    @Column("text", { array: true, nullable: true })
    idRange?: string[];

    @ManyToOne(() => CollectionEntity, (collection) => collection.collectionFragments)
    collection: CollectionEntity;

    @OneToMany(() => CollectionFragmentRoutingEntity, (en) => en.inCollectionFragment)
    inRoutes?: CollectionFragmentRoutingEntity[];

    @OneToMany(() => CollectionFragmentRoutingEntity, (en) => en.outCollectionFragment)
    outRoutes?: CollectionFragmentRoutingEntity[];

    @OneToMany(() => AssetEntity, (bridgeAsset) => bridgeAsset.collectionFragment)
    bridgeAssets?: AssetEntity[];

    @OneToMany(() => CompositePartEntity, (compositePart) => compositePart.collectionFragment)
    compositeParts?: CompositePartEntity[];

    @OneToMany(() => ResourceInventoryEntity, (rie) => rie.collectionFragment)
    resourceInventoryItems?: ResourceInventoryEntity[];

    @OneToMany(() => MaterialEntity, (material) => material.collectionFragment)
    materials?: MaterialEntity[];
}
