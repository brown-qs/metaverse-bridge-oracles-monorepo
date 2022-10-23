import { IsNumber } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CollectionFragmentEntity } from "../collectionfragment/collectionfragment.entity";


@Entity()
@Unique(["inCollectionFragment"])
export class CollectionFragmentRoutingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: null })
    description: string;

    @ManyToOne(() => CollectionFragmentEntity, (en) => en.inRoutes, { nullable: false })
    inCollectionFragment: CollectionFragmentEntity;

    @ManyToOne(() => CollectionFragmentEntity, (en) => en.inRoutes, { nullable: false })
    outCollectionFragment: CollectionFragmentEntity;

    @ManyToMany(() => CollectionFragmentEntity, { nullable: true })
    @JoinTable({ name: "collection_fragment_routing_additional_entity" })
    outCollectionFragmentAdditionalTokens: CollectionFragmentEntity[];
}
