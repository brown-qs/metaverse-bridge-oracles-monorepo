import {
    IsEnum,
    IsNotEmpty,
    IsString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AssetType } from '../common/enums/AssetType';
import { TextureType } from './texturetype.enum';

@Entity()
@Index(['assetType', 'assetAddress', 'assetId'])
export class TextureEntity {
    constructor(skin: Partial<TextureEntity>) {
        Object.assign(this, skin);
    }

    @PrimaryColumn()
    @IsEnum(AssetType)
    @Column({
        type: 'enum',
        enum: AssetType
    })
    assetType: AssetType;

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

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.textures)
    owner?: UserEntity;
}
