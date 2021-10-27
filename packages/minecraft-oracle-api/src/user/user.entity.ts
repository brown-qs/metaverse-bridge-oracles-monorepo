import {
    IsBoolean,
    IsEnum,
    IsString
} from 'class-validator';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from '../common/enums/UserRole';
import { TextureEntity } from '../texture/texture.entity';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { AssetEntity } from '../asset/asset.entity';
import { SummonEntity } from '../summon/summon.entity';

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
    hasGame?: boolean;

    @IsBoolean()
    @Column({ default: false })
    hasTicket?: boolean;

    @IsBoolean()
    @Column({ default: false })
    hasMoonsama?: boolean;

    @Column({nullable: true})
    @IsString()
    serverId?: string;
    
    @IsString()
    @Column({ default: null, nullable: true })
    lastUsedAddress?: string;

    @Column('text', { array: true, default: [] })
    usedAddresses?: string[];

    @OneToMany(() => AssetEntity, (ae) => ae.owner)
    assets?: AssetEntity[];

    @OneToMany(() => SummonEntity, (se) => se.owner)
    summons?: SummonEntity[];

    @OneToMany(() => SnapshotItemEntity, (sitem) => sitem.owner)
    snapshotItems?: SnapshotItemEntity[];

    @OneToMany(() => TextureEntity, (skin) => skin.owner)
    textures?: TextureEntity[];

    @OneToOne(() => UserEntity, (user) => user.gganbu)
    @JoinColumn()
    gganbu?: UserEntity;
}
