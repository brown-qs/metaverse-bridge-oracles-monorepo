import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { MinecraftLinkEvent } from 'src/common/enums/MinecraftLinkEvent';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class MinecraftLinkEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userUuid: string;

    @Column()
    minecraftUuid: string;

    @IsEnum(MinecraftLinkEvent)
    @Column({
        type: 'enum',
        enum: MinecraftLinkEvent,
    })
    event: MinecraftLinkEvent;

    @CreateDateColumn()
    createdAt: Date;
}
