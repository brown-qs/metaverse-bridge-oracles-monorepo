import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class EmailLoginKeyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    loginKey: string;

    @Column({ type: "timestamptz", nullable: true })
    keyGenerationDate: Date;

    @Column({ type: "timestamptz" })
    createdAt: Date;

    @Column({ type: "timestamptz", default: null, nullable: true })
    lastLogin: Date;

    //will change existing user with this uuid if login successful
    @ManyToOne(() => UserEntity, (user) => user.emailLoginKeyEmailChanges, { nullable: true })
    changeUser: UserEntity
}
