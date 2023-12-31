import {
    IsBoolean,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user/user.entity';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { AssetEntity } from '../asset/asset.entity';
import { ResourceInventoryOffsetEntity } from '../resourceinventoryoffset/resourceinventoryoffset.entity';

@Entity()
@Index(['id'], { unique: true })
export class ResourceInventoryEntity {

    constructor(item: Partial<ResourceInventoryEntity>) {
        Object.assign(this, item);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column({ nullable: true, default: '0' })
    @IsString()
    amount: string;

    @Column()
    @IsBoolean()
    assetId: string;

    @OneToMany(() => ResourceInventoryOffsetEntity, (offset) => offset.resourceInventory)
    offsets?: ResourceInventoryOffsetEntity[];

    @ManyToOne(() => UserEntity, (user) => user.resourceInventoryItems)
    owner: UserEntity;

    @ManyToOne(() => CollectionFragmentEntity, (collectionFragment) => collectionFragment.resourceInventoryItems)
    collectionFragment?: CollectionFragmentEntity

    @OneToMany(() => AssetEntity, (asset) => asset.resourceInventory)
    assets?: AssetEntity[]
}
