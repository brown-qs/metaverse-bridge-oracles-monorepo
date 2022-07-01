import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class EmailChangeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userUuid: string;

    @Column()
    oldEmail: string;

    @Column()
    newEmail: string;

    @CreateDateColumn()
    createdAt: Date;
}
