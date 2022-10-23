import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { CollectionFragmentEntity } from "../collectionfragment/collectionfragment.entity";
import { CompositeSkeletonBoneMapEntity } from "../composite-skeleton-bone-map/composite-skeleton-bone-map.entity";
import { CompositeCollectionFragmentEntity } from "../compositecollectionfragment/compositecollectionfragment.entity";

@Entity()
export class CompositeSkeletonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: null })
    description: string;

    @Column({ type: 'json', nullable: false })
    config: unknown;

    @ManyToOne(() => CompositeCollectionFragmentEntity, (en) => en.skeletons, { nullable: false })
    compositeCollectionFragment: CompositeCollectionFragmentEntity

    @OneToMany(() => CompositeSkeletonBoneMapEntity, (en) => en.skeleton, { nullable: false })
    boneMaps: CompositeSkeletonBoneMapEntity[];

}
