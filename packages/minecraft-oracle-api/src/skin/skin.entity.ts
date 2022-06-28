import {
    IsBoolean,
    IsString
} from 'class-validator';
import { UserEntity } from '../user/user/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { TextureEntity } from '../texture/texture.entity';

@Entity()
@Index(['id'], {unique: true})
export class SkinEntity {
    constructor(skin: Partial<SkinEntity>) {
        Object.assign(this, skin);
    }

    public static toId = (userUuid: string, assetAddress: string, assetId: string) => {
        return `${userUuid}-${assetAddress.toLowerCase()}-${assetId}`
    }

    @IsString()
    @PrimaryColumn()
    id: string; // {useruuid}-{assetAddress}-{assetId}

    @IsBoolean()
    @Column({default: false})
    equipped?: boolean;

    @ManyToOne(() => TextureEntity, (texture: TextureEntity) => texture.skins, {nullable: false})
    texture: TextureEntity;

    @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.skins, {nullable: false})
    owner: UserEntity;
}
