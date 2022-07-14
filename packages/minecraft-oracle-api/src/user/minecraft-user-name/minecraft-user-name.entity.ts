import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MinecraftLinkEntity } from '../minecraft-link/minecraft-link.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class MinecraftUserNameEntity {
    @PrimaryColumn()
    minecraftUserName: string;

    @OneToMany(() => MinecraftLinkEntity, (en) => en.minecraftUserName)
    minecraftLinks: MinecraftLinkEntity[];
}
