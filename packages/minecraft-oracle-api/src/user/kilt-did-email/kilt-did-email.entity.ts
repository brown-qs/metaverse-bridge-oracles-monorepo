import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

//did can have many emails, and email can have many dids
//We want to keep track in case somebody has a wallet compromise
@Unique(["did", "email"])
@Entity()
export class KiltDidEmailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    did: string;

    @Column()
    email: string;
}
