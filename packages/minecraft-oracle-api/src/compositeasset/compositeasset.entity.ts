import {
    IsJSON,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompositeCollectionFragmentEntity } from '../compositecollectionfragment/compositecollectionfragment.entity';
import { AssetEntity } from '../asset/asset.entity';

@Entity()
export class CompositeAssetEntity {

    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @Column()
    @IsString()
    assetId: string;

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    originalMetadata?: unknown;

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    compositeMetadata?: unknown;

    @ManyToOne(() => CompositeCollectionFragmentEntity, (ccf) => ccf.composites)
    collection: CompositeCollectionFragmentEntity;

    @OneToMany(() => AssetEntity, (asset) => asset.compositeAsset)
    children?: AssetEntity[];
}
