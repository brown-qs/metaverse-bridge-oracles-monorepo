import {
    IsEnum,
    IsString
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryColumn, Unique } from 'typeorm';
import { UserRole } from '../common/enums/UserRole';
import { SkinEntity } from 'src/skin/skin.entity';
import { SnapshotItemEntity } from 'src/snapshot/snapshotItem';

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

    @ApiPropertyOptional({ description: 'Ethereum address last used by the user' })
    @IsString()
    @Column({ default: null })
    lastUsedAddress?: string;

    @ApiPropertyOptional({ description: 'Ethereum addresses used by the user so far'})
    @Column('text', { array: true, default: [] })
    usedAddresses?: string[];

    @ApiPropertyOptional({ description: 'Snapshotted (exported) game items of user' })
    @OneToMany(() => SnapshotItemEntity, (sitem) => sitem.owner)
    snapshotItems?: SnapshotItemEntity[];

    @ApiPropertyOptional({ description: 'Equipped skin' })
    @OneToOne(() => SkinEntity, (skin) => skin.owner)
    skin?: SkinEntity;
}
