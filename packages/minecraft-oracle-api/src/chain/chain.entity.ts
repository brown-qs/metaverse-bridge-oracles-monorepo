import {
    IsBoolean,
    IsNumber,
    IsString
} from 'class-validator';
import { CollectionEntity } from '../collection/collection.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['chainId'])
export class ChainEntity {

    @PrimaryColumn({ unique: true })
    @IsNumber()
    chainId: number;

    @Column()
    @IsString()
    chainName: string;

    @Column()
    @IsString()
    rpcUrl: string;

    @Column({ nullable: true, default: null })
    @IsString()
    multiverseV1Address: string;

    @Column({ nullable: true, default: null })
    @IsString()
    multiverseV2Address: string;

    @Column({ nullable: true, default: null })
    @IsString()
    multicallAddress?: string;

    @Column()
    @IsBoolean()
    allowed: boolean;

    @OneToMany(() => CollectionEntity, (cc) => cc.chain)
    compositeCollections?: CollectionEntity[]
}
