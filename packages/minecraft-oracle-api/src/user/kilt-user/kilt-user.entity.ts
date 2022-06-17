import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['did'], { unique: true })
@Index(['minecraftUuid'], { unique: true })
export class KiltUserEntity {

    @PrimaryColumn()
    @IsString()
    did: string;

    @Column({ default: null, nullable: true, unique: true })
    minecraftUuid: string;
}
