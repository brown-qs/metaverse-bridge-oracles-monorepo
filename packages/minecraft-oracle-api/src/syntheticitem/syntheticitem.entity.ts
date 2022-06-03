import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';

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
}
