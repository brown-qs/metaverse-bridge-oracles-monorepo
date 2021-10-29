import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsString
} from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { StringAssetType } from '../common/enums/AssetType';

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
    @IsEnum(StringAssetType)
    @Column({
        type: 'enum',
        enum: StringAssetType,
        default: StringAssetType.NONE
    })
    assetType: StringAssetType;

    @Column()
    @IsString()
    amount: string;
    
    @Column()
    @IsString()
    assetAddress: string;

    @Column()
    @IsString()
    assetId: string;

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

    @ManyToOne(() => UserEntity, (user) => user.assets)
    owner?: UserEntity
}
