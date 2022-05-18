import {
    IsBoolean,
    IsEnum,
    IsJSON,
    IsNumber,
    IsString
} from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { StringAssetType } from '../common/enums/AssetType';
import { RecognizedAssetType } from '../config/constants';
import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';

@Entity()
@Index(['hash'], {unique: true})
export class AssetEntity {

    constructor(asset: Partial<AssetEntity>) {
        Object.assign(this, asset);
    }

    @PrimaryColumn()
    @IsString()
    hash: string;

    @Column()
    @IsString()
    amount: string;

    @Column()
    @IsString()
    assetId: string;

    @Column({nullable: true})
    @IsString()
    assetOwner?: string;

    @IsBoolean()
    @Column()
    enraptured: boolean;
    
    @IsBoolean()
    @Column()
    pendingIn: boolean;

    @IsBoolean()
    @Column()
    pendingOut: boolean;

    @IsString()
    @Column({ type: 'bigint', nullable: true })
    expiration?: string;

    @IsString()
    @Column({ nullable: true })
    requestHash?: string;

    @IsString()
    @Column({ nullable: true })
    salt?: string;

    @IsString()
    @Column({ nullable: true, default: null })
    world?: string;

    @IsEnum(RecognizedAssetType)
    @Column({
        type: 'enum',
        enum: RecognizedAssetType,
        default: RecognizedAssetType.NONE
    })
    recognizedAssetType?: RecognizedAssetType

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    metadata?: unknown;

    @ManyToOne(() => UserEntity, (user) => user.assets)
    owner?: UserEntity

    @ManyToOne(() => CompositeAssetEntity, (compositeAsset) => compositeAsset.children)
    compositeAsset?: CompositeAssetEntity

    @ManyToOne(() => CollectionFragmentEntity, (collectionFragment) => collectionFragment.bridgeAssets)
    collectionFragment?: CollectionFragmentEntity
}
