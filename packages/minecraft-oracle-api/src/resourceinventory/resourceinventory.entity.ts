import {
    IsBoolean,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';

@Entity()
@Index(['id'], {unique: true})
export class ResourceInventoryEntity {

    constructor(item: Partial<ResourceInventoryEntity>) {
        Object.assign(this, item);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column({nullable: true, default: '0'})
    @IsString()
    amount: string;

    @Column()
    @IsBoolean()
    assetId: string;

    @ManyToOne(() => UserEntity, (user) => user.resourceInventoryItems)
    owner: UserEntity;

    @ManyToOne(() => CollectionFragmentEntity, (collectionFragment) => collectionFragment.resourceInventoryItems)
    collectionFragment?: CollectionFragmentEntity
}
