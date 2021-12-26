import {
    IsBoolean,
    IsEnum,
    IsString
} from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { StringAssetType } from '../common/enums/AssetType';
import { TextureType } from './texturetype.enum';
import { SkinEntity } from '../skin/skin.entity';

@Entity()
@Index(['assetType', 'assetAddress', 'assetId'])
export class TextureEntity {
    constructor(skin: Partial<TextureEntity>) {
        Object.assign(this, skin);
    }

    @PrimaryColumn()
    @IsEnum(StringAssetType)
    @Column({
        type: 'enum',
        enum: StringAssetType
    })
    assetType: StringAssetType;

    @PrimaryColumn({unique: true})
    @IsString()
    assetAddress: string;

    @PrimaryColumn()
    @IsString()
    assetId: string;

    @Column('text', { array: true, default: [] })
    accessories?: string[];

    @IsEnum(TextureType)
    @Column({
        type: 'enum',
        enum: TextureType,
        nullable: false
    })
    type: TextureType;

    @IsString()
    @Column()
    textureData: string;

    @IsString()
    @Column()
    textureSignature: string;

    @IsString()
    @Column({nullable: true})
    textureUuid?: string;

    @IsString()
    @Column({nullable: true})
    name?: string;

    @IsBoolean()
    @Column({default: false})
    auction?: boolean;

    @OneToMany(() => SkinEntity, (skin: SkinEntity) => skin.texture)
    skins?: SkinEntity[];
}
