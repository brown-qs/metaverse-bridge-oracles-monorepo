import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { CollectionEntity } from '../collection/collection.entity';


@Entity()
export class CompositeCollectionFragmentEntity {

    @PrimaryColumn()
    id: string

    @ManyToOne(() => CollectionEntity, (collection) => collection.compositeCollectionFragments)
    collection: CollectionEntity;

    @OneToMany(() => CompositeAssetEntity, (composite) => composite.compositeCollectionFragment)
    composites?: CompositeAssetEntity[];
}
