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

    @Column()
    @IsString()
    name: string;

    @Column("text", { array: true, nullable: true })
    idRange?: string[];

    @ManyToOne(() => CollectionEntity, (collection) => collection.collectionFragments)
    collection: CollectionEntity;

    @OneToMany(() => AssetEntity, (bridgeAsset) => bridgeAsset.collectionFragment)
    bridgeAssets?: AssetEntity[];

    @OneToMany(() => CompositePartEntity, (compositePart) => compositePart.collectionFragment)
    compositeParts?: CompositePartEntity[];
}
