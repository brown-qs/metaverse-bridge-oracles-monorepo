import {
    IsBoolean,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['chainId'])
export class ChainEntity {

    @PrimaryColumn({unique: true})
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
    multiverseAddress: string;
    
    @Column({ nullable: true, default: null })
    @IsString()
    multicallAddress?: string;

    @Column()
    @IsBoolean()
    allowed: boolean;
}
