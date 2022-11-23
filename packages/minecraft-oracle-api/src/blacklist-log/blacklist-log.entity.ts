
import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user/user.entity';

export enum BlacklistAction {
    Blacklist = "BLACKLIST",
    UnBlacklist = "UN_BLACKLIST"
}
@Entity()
export class BlacklistLogEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => UserEntity, (en) => en.blacklistLogs, { nullable: false })
    user: UserEntity

    @Column({ nullable: false })
    note: string

    @Column({ type: "enum", enum: BlacklistAction, nullable: false })
    action: BlacklistAction

    @ManyToOne(() => UserEntity, (en) => en.blacklistLogInitiations, { nullable: false })
    initiator: UserEntity

    @Column({ type: "timestamptz", nullable: false })
    createdAt: Date
}
