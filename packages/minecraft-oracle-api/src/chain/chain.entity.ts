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

    @Column({ nullable: true, default: null })
    @IsString()
    multiverseV1IndexerUrl: string;

    @Column({ nullable: true, default: null })
    @IsString()
    multiverseV2IndexerUrl: string;

    @Column({ nullable: true, default: null })
    @IsString()
    tokenIndexerUrl: string;

    @Column()
    @IsBoolean()
    allowed: boolean;

    @Column({ nullable: false, default: false })
    @IsBoolean()
    faucetEnabled: boolean;

    @OneToMany(() => CollectionEntity, (cc) => cc.chain)
    compositeCollections?: CollectionEntity[]
}
