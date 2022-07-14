import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EmailChangeEntity } from '../email-change/email-change.entity';
import { EmailLoginKeyEntity } from '../email-login-key/email-login-key.entity';
import { KiltSessionEntity } from '../kilt-session/kilt-session.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class EmailEntity {
    @PrimaryColumn()
    email: string;

    @OneToMany(() => KiltSessionEntity, (ks) => ks.email)
    kiltSessions: KiltSessionEntity[];

    @OneToMany(() => EmailChangeEntity, (en) => en.oldEmail)
    oldEmailChanges: EmailChangeEntity[];

    @OneToMany(() => EmailChangeEntity, (en) => en.newEmail)
    newEmailChanges: EmailChangeEntity[];

    @OneToMany(() => EmailLoginKeyEntity, (en) => en.email)
    loginKeys: EmailLoginKeyEntity[];
}
