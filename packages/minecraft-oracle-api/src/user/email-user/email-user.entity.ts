import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['minecraftUuid'], { unique: true })
export class EmailUserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: null, nullable: true })
    lastLogin: Date;

    @Column({ default: null, nullable: true, unique: true })
    minecraftUuid: string;
}
