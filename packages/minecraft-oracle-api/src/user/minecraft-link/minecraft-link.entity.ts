import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '../user/user.entity';

//TODO: figure out how to make a user have only one null unlinkedAt at a time
@Entity()
export class MinecraftLinkEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinks, { createForeignKeyConstraints: true })
    user: UserEntity

    @Column()
    minecraftUuid: string;

    @Column()
    minecraftUserName: string

    @Column()
    hasGame: boolean

    //typeorm will error out with constraint "FK_3d1d94c5f8343369466833a0b05" for relation "" already exists... if we have two relations to user on this table
    //https://github.com/typeorm/typeorm/issues/9171
    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations, { createForeignKeyConstraints: false })
    linkInitiator: UserEntity

    //use timestamp type and always send it utc date
    @Column({ type: "timestamptz" })
    linkedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations, { createForeignKeyConstraints: false })
    unlinkInitiator: UserEntity

    @Column({ type: "timestamptz", nullable: true })
    unlinkedAt: Date
}
