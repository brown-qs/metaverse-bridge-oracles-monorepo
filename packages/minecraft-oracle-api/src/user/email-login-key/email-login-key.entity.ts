import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailLoginKeyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    loginKey: string;

    @Column({ nullable: true })
    keyGenerationDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: null, nullable: true })
    lastLogin: Date;
}
