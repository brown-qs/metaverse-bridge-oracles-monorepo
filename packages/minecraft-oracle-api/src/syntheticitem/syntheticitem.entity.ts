import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';
import { SyntheticSubItemEntity } from '../syntheticsubitem/syntheticsubitem.entity';

@Entity()
export class SyntheticItemEntity {

    @PrimaryColumn()
    id: string

    @Column()
    assetId: string

    @Column({ type: 'json', nullable: true })
    attributes?: any;

    @ManyToMany(() => CompositeAssetEntity, (compositeAsset) => compositeAsset.syntheticChildren)
    compositeAssets?: CompositeAssetEntity[];

    @ManyToOne(() => SyntheticPartEntity, (syntheticPart) => syntheticPart.items)
    syntheticPart: SyntheticPartEntity;

    @OneToMany(() => SyntheticSubItemEntity, (en) => en.id)
    subItems: SyntheticSubItemEntity[]
}
