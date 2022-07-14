import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { EmailEntity } from '../email/email.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
@Unique(['email'])
export class EmailLoginKeyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EmailEntity, (en) => en.email, { nullable: false })
    @JoinColumn({ name: "email" })
    email: EmailEntity

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
