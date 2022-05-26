import {
    IsJSON,
    IsString
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CompositeCollectionFragmentEntity } from '../compositecollectionfragment/compositecollectionfragment.entity';
import { AssetEntity } from '../asset/asset.entity';
import { CompositeMetadataType } from './types';
import { SyntheticItemEntity } from '../syntheticitem/syntheticitem.entity';

@Entity()
export class CompositeAssetEntity {

    @PrimaryColumn()
    id: string;

    @Column()
    @IsString()
    assetId: string;

    @Column({ nullable: true })
    originalMetadataUri?: string

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    originalMetadata?: CompositeMetadataType;

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    compositeMetadata?: CompositeMetadataType;

    @ManyToOne(() => CompositeCollectionFragmentEntity, (ccf) => ccf.compositeAssets)
    compositeCollectionFragment: CompositeCollectionFragmentEntity;

    @OneToMany(() => AssetEntity, (asset) => asset.compositeAsset)
    children?: AssetEntity[];

    @OneToMany(() => SyntheticItemEntity, (sItem) => sItem.compositeAsset)
    syntheticChildren?: SyntheticItemEntity[];
}
