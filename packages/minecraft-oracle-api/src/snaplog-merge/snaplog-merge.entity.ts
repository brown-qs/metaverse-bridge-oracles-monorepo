import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user/user.entity';
import { MaterialEntity } from '../material/material.entity';
import { GameEntity } from '../game/game.entity';

@Entity()
@Index(['id'], { unique: true })
export class SnaplogMergeEntity {
    @PrimaryColumn()
    id: string; // convention:: {user uuid}-{materialName}

    @Column()
    amount: string;

    @Column({ type: "bigint" })
    processedAt: string;

    @Column({ nullable: true, default: 0 })
    adjustedPower?: number;

    @ManyToOne(() => MaterialEntity, (material) => material.snaplogs)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snaplogMerges, { nullable: false })
    user: UserEntity;

}
