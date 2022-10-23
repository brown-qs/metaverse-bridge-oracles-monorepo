import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { CollectionEntity } from '../collection/collection.entity';
import { CompositePartEntity } from '../compositepart/compositepart.entity';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';
import { CompositeSkeletonEntity } from '../composite-skeleton/composite-skeleton.entity';

@Entity()
export class CompositeCollectionFragmentEntity {

    @PrimaryColumn()
    id: string

    @Column()
    uriPrefix: string

    @Column()
    uriPostfix: string

    @ManyToOne(() => CollectionEntity, (collection) => collection.compositeCollectionFragments)
    collection: CollectionEntity;

    @OneToMany(() => CompositeSkeletonEntity, (en) => en.compositeCollectionFragment)
    skeletons?: CompositeSkeletonEntity[]

    @OneToMany(() => CompositeAssetEntity, (composite) => composite.compositeCollectionFragment)
    compositeAssets?: CompositeAssetEntity[];

    @OneToMany(() => CompositePartEntity, (compositePart) => compositePart.compositeCollectionFragment)
    compositeParts?: CompositePartEntity[];

    @OneToMany(() => SyntheticPartEntity, (syntheticPart) => syntheticPart.compositeCollectionFragment)
    syntheticParts?: SyntheticPartEntity[];
}
