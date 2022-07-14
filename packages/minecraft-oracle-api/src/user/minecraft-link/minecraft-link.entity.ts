import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MinecraftUserNameEntity } from '../minecraft-user-name/minecraft-user-name.entity';
import { MinecraftUuidEntity } from '../minecraft-uuid/minecraft-uuid.entity';
import { UserEntity } from '../user/user.entity';

//TODO: figure out how to make a user have only one null unlinkedAt at a time
@Entity()
export class MinecraftLinkEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinks, { createForeignKeyConstraints: true, nullable: false })
    user: UserEntity

    @ManyToOne(() => MinecraftUuidEntity, (en) => en.minecraftUuid, { nullable: false })
    @JoinColumn({ name: "minecraftUuid" })
    minecraftUuid: MinecraftUuidEntity

    @ManyToOne(() => MinecraftUserNameEntity, (en) => en.minecraftUserName, { nullable: false })
    @JoinColumn({ name: "minecraftUserName" })
    minecraftUserName: MinecraftUserNameEntity

    @Column({ nullable: false })
    hasGame: boolean

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations, { createForeignKeyConstraints: true, nullable: false })
    linkInitiator: UserEntity

    //use timestamp type and always send it utc date
    @Column({ type: "timestamptz", nullable: false })
    linkedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations, { createForeignKeyConstraints: true, nullable: true })
    unlinkInitiator: UserEntity

    @Column({ type: "timestamptz", nullable: true })
    unlinkedAt: Date
}
