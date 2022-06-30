import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';





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
    encryptionKeyId?: string;

    @Column({ default: false, nullable: false })
    verified?: boolean;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
