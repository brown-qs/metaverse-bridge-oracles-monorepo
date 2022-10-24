import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';
import { SyntheticItemEntity } from '../syntheticitem/syntheticitem.entity';

@Entity()
export class SyntheticItemLayerEntity {

    @PrimaryColumn()
    id: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: false, default: 0 })
    zIndex: number

    @ManyToOne(() => SyntheticItemEntity, (en) => en.layers)
    syntheticItem: SyntheticItemEntity;
}
