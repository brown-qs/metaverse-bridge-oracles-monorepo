import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

//did can have many emails, and email can have many dids
//We want to keep track in case somebody has a wallet compromise
@Entity()
export class MinecraftUuidUserNameEntity {
    @PrimaryColumn({ unique: true })
    minecraftUuid: string;

    @Column()
    minecraftUserName: string;

    @UpdateDateColumn()
    updatedAt: Date;
}
