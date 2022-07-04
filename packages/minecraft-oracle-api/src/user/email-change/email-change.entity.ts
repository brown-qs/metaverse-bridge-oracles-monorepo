import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class EmailChangeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.emailChanges, { createForeignKeyConstraints: true })
    user: UserEntity

    //typeorm will error out with constraint "FK_3d1d94c5f8343369466833a0b05" for relation "email_change_entity" already exists... if we have two relations to user on this table
    @ManyToOne(() => UserEntity, (user) => user.emailChangeInitiations, { createForeignKeyConstraints: false })
    initiator: UserEntity

    @Column()
    oldEmail: string;

    @Column()
    newEmail: string;

    @CreateDateColumn()
    createdAt: Date;
}
