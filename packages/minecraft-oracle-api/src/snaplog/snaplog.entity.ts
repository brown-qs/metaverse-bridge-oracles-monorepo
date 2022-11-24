import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user/user.entity';
import { MaterialEntity } from '../material/material.entity';
import { GameEntity } from '../game/game.entity';

@Entity()
@Index(['id'], { unique: true })
export class SnaplogEntity {

    constructor(snapshotItem: Partial<SnaplogEntity>) {
        Object.assign(this, snapshotItem);
    }

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

    //decided to override fk constraint because weren't sure how to handle user merging
    @ManyToOne(() => UserEntity, (user) => user.snaplogs, { createForeignKeyConstraints: false })
    owner: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.newSnaplogs, { createForeignKeyConstraints: true, nullable: true })
    user: UserEntity;

    @ManyToOne(() => GameEntity, (game) => game.snaplogs)
    game?: GameEntity;
}
