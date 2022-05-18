import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CompositeCollectionFragmentEntity } from '../compositecollectionfragment/compositecollectionfragment.entity';

@Entity()
export class CompositePartEntity {

    @PrimaryColumn()
    id: string

    @Column()
    zIndex: number

    @Column()
    uriPrefix: string

    @Column()
    uriPostfix: string

    @ManyToOne(() => CompositeCollectionFragmentEntity, (compositeCollectionFragment) => compositeCollectionFragment.compositeParts)
    compositeCollectionFragment: CompositeCollectionFragmentEntity;

    @ManyToOne(() => CollectionFragmentEntity, (collectionFragment) => collectionFragment.compositeParts)
    collectionFragment: CollectionFragmentEntity;
}
