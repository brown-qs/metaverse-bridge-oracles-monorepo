import { CompositeAssetEntity } from '../compositeasset/compositeasset.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SyntheticPartEntity } from '../syntheticpart/syntheticpart.entity';
import { SyntheticItemLayerEntity } from '../syntheticitemlayer/syntheticitemlayer.entity';

@Entity()
export class SyntheticItemEntity {

    @PrimaryColumn()
    id: string

    @Column()
    assetId: string

    @Column({ type: 'json', nullable: true })
    attributes?: any;

    @Column({ default: true, nullable: false })
    showInCustomizer: boolean;

    @ManyToMany(() => CompositeAssetEntity, (compositeAsset) => compositeAsset.syntheticChildren)
    compositeAssets?: CompositeAssetEntity[];

    @ManyToOne(() => SyntheticPartEntity, (syntheticPart) => syntheticPart.items)
    syntheticPart: SyntheticPartEntity;

    @OneToMany(() => SyntheticItemLayerEntity, (en) => en.syntheticItem)
    layers: SyntheticItemLayerEntity[]
}
