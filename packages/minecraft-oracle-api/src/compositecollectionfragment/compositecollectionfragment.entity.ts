import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { CollectionEntity } from '../collection/collection.entity';
import { CompositePartEntity } from 'src/compositepart/compositepart.entity';

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

    @OneToMany(() => CompositeAssetEntity, (composite) => composite.compositeCollectionFragment)
    compositeAssets?: CompositeAssetEntity[];

    @OneToMany(() => CompositePartEntity, (compositePart) => compositePart.compositeCollectionFragment)
    compositeParts?: CompositePartEntity[];
}
