import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsString
} from 'class-validator';
import { UserEntity } from '../user/user.entity';
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

    @ManyToOne(() => UserEntity, (user) => user.assets)
    owner?: UserEntity
}
