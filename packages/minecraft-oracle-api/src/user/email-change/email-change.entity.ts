import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { EmailEntity } from '../email/email.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class EmailChangeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.emailChanges, { createForeignKeyConstraints: true, nullable: false })
    user: UserEntity

    @ManyToOne(() => UserEntity, (user) => user.emailChangeInitiations, { createForeignKeyConstraints: true, nullable: false })
    initiator: UserEntity

    @ManyToOne(() => EmailEntity, (en) => en.email, { nullable: false })
    @JoinColumn({ name: "oldEmail" })
    oldEmail: EmailEntity

    @ManyToOne(() => EmailEntity, (en) => en.email, { nullable: false })
    @JoinColumn({ name: "newEmail" })
    newEmail: EmailEntity

    @Column({ type: "timestamptz" })
    createdAt: Date;
}
