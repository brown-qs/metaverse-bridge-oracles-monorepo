import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class MinecraftLinkEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinks, { createForeignKeyConstraints: true })
    user: UserEntity

    //typeorm will error out with constraint "FK_3d1d94c5f8343369466833a0b05" for relation "" already exists... if we have two relations to user on this table
    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations, { createForeignKeyConstraints: false })
    initiator: UserEntity

    @Column()
    minecraftUuid: string;

    @IsEnum(MinecraftLinkEvent)
    @Column({
        type: 'enum',
        enum: MinecraftLinkEvent,
    })
    event: MinecraftLinkEvent;

    @Column()
    initiatorUuid: string

    @CreateDateColumn()
    createdAt: Date;
}
