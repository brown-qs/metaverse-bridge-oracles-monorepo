import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { CollectionFragmentEntity } from "../collectionfragment/collectionfragment.entity";
import { SkeletonBoneMapBlend, SkeletonBoneMapPass } from "../common/enums";
import { CompositeSkeletonEntity } from "../composite-skeleton/composite-skeleton.entity";
import { CompositePartEntity } from "../compositepart/compositepart.entity";
import { SyntheticItemEntity } from "../syntheticitem/syntheticitem.entity";

@Entity()
export class CompositeSkeletonBoneMapEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CompositeSkeletonEntity, (en) => en.boneMaps, { nullable: false })
  skeleton: CompositeSkeletonEntity;

  @ManyToOne(() => SyntheticItemEntity, (en) => en.boneMaps, { nullable: true })
  syntheticItem: SyntheticItemEntity;

  @ManyToOne(() => CompositePartEntity, (en) => en.boneMaps, { nullable: true })
  compositePart: CompositePartEntity;

  @Column({ nullable: false })
  imageUrl: string

  @Column({ nullable: false })
  bone: string

  @Column({
    type: 'enum',
    enum: SkeletonBoneMapPass,
    default: SkeletonBoneMapPass.Default,
    nullable: false
  })
  pass: SkeletonBoneMapPass;

  @Column({ nullable: false, default: 0 })
  zIndex: number

  @Column({
    type: 'enum',
    enum: SkeletonBoneMapBlend,
    default: SkeletonBoneMapBlend.Default,
    nullable: false
  })
  blend: SkeletonBoneMapBlend;

  @Column({ nullable: false, default: 1 })
  opacity: number

  @Column({ nullable: false, default: 1280 })
  width: number

  @Column({ nullable: false, default: 1280 })
  height: number

  @Column({ nullable: false, default: 0 })
  x: number

  @Column({ nullable: false, default: 0 })
  y: number

  @Column({ nullable: false, default: 0 })
  pivot_x: number

  @Column({ nullable: false, default: 0 })
  pivot_y: number
}
