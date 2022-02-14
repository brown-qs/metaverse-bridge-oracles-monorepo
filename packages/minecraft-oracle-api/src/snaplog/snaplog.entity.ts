import {
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MaterialEntity } from '../material/material.entity';
import { GameEntity } from '../game/game.entity';

@Entity()
@Index(['id'], {unique: true})
export class SnaplogEntity {

    constructor(snapshotItem: Partial<SnaplogEntity>) {
        Object.assign(this, snapshotItem);
    }

    @PrimaryColumn()
    @IsString()
    id: string; // convention:: {user uuid}-{materialName}

    @Column()
    @IsString()
    amount: string;

    @Column({type: "bigint"})
    @IsString()
    processedAt: string;
    
    @ManyToOne(() => MaterialEntity, (material) => material.snaplogs)
    material: MaterialEntity;

    @ManyToOne(() => UserEntity, (user) => user.snaplogs)
    owner: UserEntity;

    @ManyToOne(() => GameEntity, (game) => game.snaplogs)
    game?: GameEntity;
}
