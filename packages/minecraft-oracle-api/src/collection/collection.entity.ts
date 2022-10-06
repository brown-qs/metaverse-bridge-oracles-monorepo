import {
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { ChainEntity } from '../chain/chain.entity';
import { StringAssetType } from '../common/enums/AssetType';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { CompositeCollectionFragmentEntity } from '../compositecollectionfragment/compositecollectionfragment.entity';
import { MultiverseVersion } from '../config/constants';

@Entity()
@Index(['chainId', 'assetAddress'], { unique: true })
export class CollectionEntity {

    @PrimaryColumn()
    chainId: number;

    @PrimaryColumn()
    assetAddress: string;

    @Column({
        type: 'enum',
        enum: StringAssetType
    })
    assetType: StringAssetType;

    @Column({
        type: 'enum',
        nullable: false,
        enum: MultiverseVersion,
        default: MultiverseVersion.V1
    })
    multiverseVersion: MultiverseVersion;

    @Column({ nullable: true })
    @IsString()
    name?: string;

    @ManyToOne(() => ChainEntity, (chain) => chain.compositeCollections)
    chain: ChainEntity;

    @OneToMany(() => CollectionFragmentEntity, (fragment) => fragment.collection)
    collectionFragments?: CollectionFragmentEntity[];

    @OneToMany(() => CompositeCollectionFragmentEntity, (fragment) => fragment.collection)
    compositeCollectionFragments?: CompositeCollectionFragmentEntity[];
}
