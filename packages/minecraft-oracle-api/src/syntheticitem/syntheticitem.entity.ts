import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';

@Entity()
export class SyntheticItemEntity {

    @PrimaryColumn()
    id: string

    @Column()
    assetId: string

    @ManyToOne(() => CompositeAssetEntity, (compositeAsset) => compositeAsset.syntheticChildren)
    compositeAsset: CompositeAssetEntity;

    @ManyToOne(() => SyntheticPartEntity, (syntheticPart) => syntheticPart.items)
    syntheticPart: SyntheticPartEntity;
}
