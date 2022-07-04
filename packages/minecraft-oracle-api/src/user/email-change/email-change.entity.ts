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

    @ManyToOne(() => UserEntity, (user) => user.emailChanges)
    user: UserEntity

    @ManyToOne(() => UserEntity, (user) => user.emailChangeInitiations)
    initiator: UserEntity

    @Column()
    oldEmail: string;

    @Column()
    newEmail: string;

    @CreateDateColumn()
    createdAt: Date;
}
