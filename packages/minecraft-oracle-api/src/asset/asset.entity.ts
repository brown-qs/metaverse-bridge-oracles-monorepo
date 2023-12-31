import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsJSON,
    IsNumber,
    IsString
} from 'class-validator';
import { UserEntity } from '../user/user/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { RecognizedAssetType, TransactionStatus } from '../config/constants';
import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { ResourceInventoryEntity } from '../resourceinventory/resourceinventory.entity';

@Entity()
@Index(['hash'], { unique: true })
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

    @Column({ type: "timestamptz", default: new Date(), nullable: false })
    @IsDate()
    createdAt: Date;

    @Column({ type: "timestamptz", default: new Date(), nullable: false })
    @IsDate()
    modifiedAt: Date;

    @Column()
    @IsString()
    assetId: string;

    @Column({ nullable: true })
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

    @IsString()
    @Column({ nullable: true, default: null })
    transactionHash?: string


    @IsDate()
    @Column({ type: "timestamptz", nullable: true, default: null })
    transactionTime?: Date

    //whether to automatically summon an asset after it has been enraptured eg 1-click migrations
    @IsBoolean()
    @Column({ nullable: false, default: false })
    autoMigrate?: boolean;

    @IsEnum(TransactionStatus)
    @Column({ type: 'enum', enum: TransactionStatus, nullable: true, default: null })
    summonTransactionStatus?: TransactionStatus

    @IsString()
    @Column({ nullable: true, default: null })
    summonTransactionHash?: string

    @Column({ type: "timestamptz", default: null, nullable: true })
    @IsDate()
    summonedAt?: Date;

    @IsJSON()
    @Column({ type: 'json', nullable: true })
    metadata?: unknown;

    @ManyToOne(() => UserEntity, (user) => user.assets, { nullable: true })
    owner?: UserEntity | null

    @ManyToOne(() => CompositeAssetEntity, (compositeAsset) => compositeAsset.children, { onDelete: 'SET NULL', nullable: true })
    compositeAsset?: CompositeAssetEntity

    @ManyToOne(() => CollectionFragmentEntity, (collectionFragment) => collectionFragment.bridgeAssets)
    collectionFragment?: CollectionFragmentEntity

    @ManyToOne(() => ResourceInventoryEntity, (rie) => rie.assets, { onUpdate: "CASCADE" })
    resourceInventory?: ResourceInventoryEntity
}
