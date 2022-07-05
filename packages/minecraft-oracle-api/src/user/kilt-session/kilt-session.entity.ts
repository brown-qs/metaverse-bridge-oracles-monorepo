import { DidResourceUri } from '@kiltprotocol/sdk-js';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { UserEntity } from 'src/user/user/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';





@Entity()
export class KiltSessionEntity {
    @PrimaryColumn()
    sessionId: string;

    @Column()
    walletSessionChallenge: string;

    @Column()
    dappName: string;

    @Column()
    dAppEncryptionKeyUri: string;

    @Column({ default: null, nullable: true })
    walletLoginChallenge?: string;

    @Column({ default: null, nullable: true })
    encryptedDid?: string;

    @Column({ default: null, nullable: true })
    did?: string;

    @Column({ default: false, nullable: false })
    didConfirmed?: boolean;

    @Column({ default: null, nullable: true })
    encryptionKeyUri?: DidResourceUri;

    @Column({ default: false, nullable: false })
    verified?: boolean;

    @ManyToOne(() => UserEntity, (user) => user.kiltSessions, { nullable: true })
    user: UserEntity

    @Column({ default: null, nullable: true })
    email: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
