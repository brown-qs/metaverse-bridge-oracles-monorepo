import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { KiltSessionEntity } from '../kilt-session/kilt-session.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class DidEntity {
    @PrimaryColumn()
    did: string;

    @OneToMany(() => KiltSessionEntity, (ks) => ks.did)
    kiltSessions: KiltSessionEntity[];
}
