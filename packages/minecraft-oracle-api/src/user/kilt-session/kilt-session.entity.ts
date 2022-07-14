import { DidResourceUri } from '@kiltprotocol/sdk-js';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { UserEntity } from 'src/user/user/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DidEntity } from '../did/did.entity';
import { EmailEntity } from '../email/email.entity';
import { KiltDappEntity } from '../kilt-dapp/kilt-dapp.entity';





@Entity()
export class KiltSessionEntity {
    @PrimaryColumn()
    sessionId: string;

    @Column()
    walletSessionChallenge: string;

    @ManyToOne(() => KiltDappEntity, (en) => en.dappName, { nullable: false })
    @JoinColumn({ name: "dappName" })
    dappName: KiltDappEntity

    @Column()
    dAppEncryptionKeyUri: string;

    @Column({ default: null, nullable: true })
    walletLoginChallenge?: string;

    @Column({ default: null, nullable: true })
    encryptedDid?: string;

    @ManyToOne(() => DidEntity, (en) => en.did, { nullable: true })
    @JoinColumn({ name: "did" })
    did: DidEntity

    @Column({ default: false, nullable: false })
    didConfirmed?: boolean;

    @Column({ default: null, nullable: true })
    encryptionKeyUri?: DidResourceUri;

    @Column({ default: false, nullable: false })
    verified?: boolean;

    @ManyToOne(() => UserEntity, (user) => user.kiltSessions, { nullable: true })
    user: UserEntity

    @ManyToOne(() => EmailEntity, (en) => en.email, { nullable: true })
    @JoinColumn({ name: "email" })
    email: EmailEntity

    @Column({ type: "timestamptz" })
    createdAt?: Date;

    @Column({ type: "timestamptz" })
    updatedAt?: Date;
}
