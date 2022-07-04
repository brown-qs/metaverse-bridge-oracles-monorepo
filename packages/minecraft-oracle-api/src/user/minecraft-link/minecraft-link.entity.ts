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

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinks)
    user: UserEntity

    @ManyToOne(() => UserEntity, (user) => user.minecraftLinkInitiations)
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
