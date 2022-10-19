import { IsNumber } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CollectionFragmentEntity } from "../collectionfragment/collectionfragment.entity";


@Entity()
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
    @JoinTable()
    outCollectionFragmentBonusTokens: CollectionFragmentEntity[];
}
