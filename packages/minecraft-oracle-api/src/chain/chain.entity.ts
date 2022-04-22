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

    @Column()
    @IsString()
    multiverseAddress: string;
    
    @IsString()
    @Column()
    multicallAddress?: string;

    @IsBoolean()
    @Column()
    allowed: boolean;
}
