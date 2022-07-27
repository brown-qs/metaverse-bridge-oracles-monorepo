import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRole } from '../../common/enums/UserRole';
import { SnapshotItemEntity } from '../../snapshot/snapshotItem.entity';
import { AssetEntity } from '../../asset/asset.entity';
import { SummonEntity } from '../../summon/summon.entity';
import { PlaySessionEntity } from '../../playsession/playsession.entity';
import { InventoryEntity } from '../../playerinventory/inventory.entity';
import { SkinEntity } from '../../skin/skin.entity';
import { PlayerAchievementEntity } from '../../playerachievement/playerachievement.entity';
import { SnaplogEntity } from '../../snaplog/snaplog.entity';
import { PlayerScoreEntity } from '../../playerscore/playerscore.entity';
import { PlayerGameItemEntity } from '../../playergameitem/playergameitem.entity';
import { ResourceInventoryEntity } from '../../resourceinventory/resourceinventory.entity';
import { EmailChangeEntity } from '../email-change/email-change.entity';
import { MinecraftLinkEntity } from '../minecraft-link/minecraft-link.entity';
import { KiltSessionEntity } from '../kilt-session/kilt-session.entity';
import { EmailLoginKeyEntity } from '../email-login-key/email-login-key.entity';
import { EmailEntity } from '../email/email.entity';
import { Oauth2ClientEntity } from 'src/oauth2api/oauth2-client/oauth2-client.entity';

@Entity()
@Unique(['email'])
export class UserEntity {
    //cannot use uuid type or postgres will insert hyphens and screw up our existing minecraft uuids
    @PrimaryColumn()
    @IsString()
    uuid: string;

    @ManyToOne(() => EmailEntity, (en) => en.email, { nullable: true, eager: true })
    @JoinColumn({ name: "email" })
    email?: EmailEntity

    @Column({ type: "timestamptz", default: null, nullable: true })
    createdAt?: Date;

    @Column({ type: "timestamptz", default: null, nullable: true })
    lastLogin?: Date;

    @Column({ type: "timestamptz", default: new Date() })
    relationsUpdatedAt?: Date;

    @Column({ unique: true, default: null, nullable: true })
    @IsString()
    minecraftUuid?: string;

    @IsEnum(UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NONE
    })
    role?: UserRole;

    //delete this after migration
    @IsString()
    @Column({ default: null, nullable: true, unique: true })
    gamerTag?: string;

    @IsString()
    @Column({ default: null, nullable: true })
    minecraftUserName?: string;

    @IsBoolean()
    @Column({ default: false })
    allowedToPlay?: boolean;

    @IsBoolean()
    @Column({ default: false })
    blacklisted?: boolean;

    @IsBoolean()
    @Column({ default: false })
    hasGame?: boolean;

    @IsBoolean()
    @Column({ default: false })
    vip?: boolean;

    @IsNumber()
    @Column({ default: 0 })
    numGamePassAsset?: number;

    @Column({ nullable: true })
    @IsString()
    serverId?: string;

    @Column({ nullable: true })
    @IsString()
    preferredServer?: string;

    @IsString()
    @Column({ default: null, nullable: true })
    lastUsedAddress?: string;

    @Column('text', { array: true, default: [] })
    usedAddresses?: string[];

    @OneToMany(() => AssetEntity, (ae) => ae.owner)
    assets?: AssetEntity[];

    @OneToMany(() => SummonEntity, (se) => se.owner)
    summons?: SummonEntity[];

    @OneToMany(() => SnapshotItemEntity, (snapshotItem) => snapshotItem.owner)
    snapshotItems?: SnapshotItemEntity[];

    @OneToMany(() => SnaplogEntity, (snaplog) => snaplog.owner)
    snaplogs?: SnaplogEntity[];

    @OneToMany(() => InventoryEntity, (iitem) => iitem.owner)
    inventoryItems?: InventoryEntity[];

    @OneToMany(() => SkinEntity, (skin) => skin.owner)
    skins?: SkinEntity[];

    @OneToMany(() => PlaySessionEntity, (session) => session.player)
    playSessions?: PlaySessionEntity[];

    @OneToMany(() => PlayerAchievementEntity, (achievement) => achievement.player)
    achievements?: PlayerAchievementEntity[];

    @OneToMany(() => PlayerGameItemEntity, (playerGameItemEntities) => playerGameItemEntities.player)
    playerGameItems?: PlayerGameItemEntity[];

    @OneToMany(() => ResourceInventoryEntity, (resourceInventoryItem) => resourceInventoryItem.owner)
    resourceInventoryItems?: ResourceInventoryEntity[];

    @OneToMany(() => PlayerScoreEntity, (score) => score.player)
    scores?: PlayerScoreEntity[];

    @OneToMany(() => EmailChangeEntity, (emailChange) => emailChange.user)
    emailChanges?: EmailChangeEntity[]

    @OneToMany(() => EmailChangeEntity, (emailChange) => emailChange.initiator)
    emailChangeInitiations?: EmailChangeEntity[]

    @OneToMany(() => EmailLoginKeyEntity, (loginKey) => loginKey.changeUser)
    emailLoginKeyEmailChanges?: EmailLoginKeyEntity[]

    @OneToMany(() => MinecraftLinkEntity, (minecraftLink) => minecraftLink.user)
    minecraftLinks?: MinecraftLinkEntity[]

    @OneToMany(() => MinecraftLinkEntity, (minecraftLink) => minecraftLink.linkInitiator)
    minecraftLinkInitiations?: MinecraftLinkEntity[]

    @OneToMany(() => MinecraftLinkEntity, (minecraftLink) => minecraftLink.unlinkInitiator)
    minecraftUnlinkInitiations?: MinecraftLinkEntity[]

    @OneToMany(() => KiltSessionEntity, (kiltSession) => kiltSession.user)
    kiltSessions?: KiltSessionEntity[]

    @OneToMany(() => Oauth2ClientEntity, (en) => en.owner)
    oauth2Clients?: Oauth2ClientEntity[]
}

//resource_inventory_entity id example: 92e1e5635d684e1294c6c6cceb8c9b71-1285-0x1b30a3b5744e733d8d2f19f0812e3f79152a8777-14
//first part is uuid, if we use hyphens in our uuids, we are screwing up hyphens as a separator in these ids
const separator = ""
export function userUuid() { function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); } return s4() + s4() + separator + s4() + separator + s4() + separator + s4() + separator + s4() + s4() + s4(); }
