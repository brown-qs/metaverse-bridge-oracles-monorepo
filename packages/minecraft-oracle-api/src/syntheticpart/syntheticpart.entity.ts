import { CompositeMetadataType } from '../compositeasset/types';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompositeCollectionFragmentEntity } from '../compositecollectionfragment/compositecollectionfragment.entity';
import { SyntheticItemEntity } from '../syntheticitem/syntheticitem.entity';

@Entity()
export class SyntheticPartEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    zIndex: number

    @Column({nullable: true})
    mediaUriPrefix: string

    @Column({nullable: true})
    mediaUriPostfix: string

    @Column()
    assetAddress: string

    @Column("text", { array: true, nullable: true })
    idRange?: string[];

    @ManyToOne(() => CompositeCollectionFragmentEntity, (compositeCollectionFragment) => compositeCollectionFragment.compositeParts)
    compositeCollectionFragment: CompositeCollectionFragmentEntity;

    @OneToMany(() => SyntheticItemEntity, (item) => item.syntheticPart)
    items?: SyntheticItemEntity[];
}
