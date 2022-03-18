import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from '../common/enums/UserRole';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { AssetEntity } from '../asset/asset.entity';
import { SummonEntity } from '../summon/summon.entity';
import { PlaySessionEntity } from '../playsession/playsession.entity';
import { InventoryEntity } from '../playerinventory/inventory.entity';
import { SkinEntity } from '../skin/skin.entity';
import { PlayerAchievementEntity } from '../playerachievement/playerachievement.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';
import { PlayerScoreEntity } from '../playerscore/playerscore.entity';
import { PlayerGameItemEntity } from '../playergameitem/playergameitem.entity';

@Entity()
@Index(['uuid'], {unique: true})
export class UserEntity {
    constructor(user: Partial<UserEntity>) {
        Object.assign(this, user);
    }

    @PrimaryColumn()
    @IsString()
    uuid: string;

    @IsEnum(UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NONE
    })
    role?: UserRole;

    @IsString()
    @Column({ default: null, nullable: true })
    userName?: string;

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

    @Column({nullable: true})
    @IsString()
    serverId?: string;

    @Column({nullable: true})
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

    @OneToOne(() => UserEntity, (user) => user.gganbu)
    @JoinColumn()
    gganbu?: UserEntity;

    @OneToMany(() => PlayerScoreEntity, (score) => score.player)
    scores?: PlayerScoreEntity[];
}
