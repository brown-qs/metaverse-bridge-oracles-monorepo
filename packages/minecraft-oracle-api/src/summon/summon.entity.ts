import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsString
} from 'class-validator';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['hash'], {unique: true})
export class SummonEntity {

    constructor(asset: Partial<SummonEntity>) {
        Object.assign(this, asset);
    }

    @PrimaryColumn()
    @IsString()
    hash: string;

    @IsBoolean()
    @Column()
    inProgress: boolean;

    @IsString()
    @Column({ type: 'bigint', nullable: true })
    expiration?: string;

    @IsString()
    @Column({ nullable: true })
    requestHash?: string;

    @IsString()
    @Column({ nullable: true })
    salt?: string;

    @ManyToOne(() => MinecraftUserEntity, (user) => user.assets)
    owner?: MinecraftUserEntity;
}
