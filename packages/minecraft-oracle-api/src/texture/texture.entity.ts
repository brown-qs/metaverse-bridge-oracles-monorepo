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
@Index(['assetType', 'assetAddress', 'assetId'], {unique: true})
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

    @PrimaryColumn()
    @IsString()
    assetAddress: string;

    @PrimaryColumn()
    @IsString()
    assetId: string;

    @IsEnum(TextureType)
    @Column({
        type: 'enum',
        enum: TextureType,
        nullable: false
    })
    type: TextureType;

    @ApiProperty({ description: 'texture data' })
    @IsNotEmpty()
    @IsString()
    @Column()
    textureData: string;

    @ApiProperty({ description: 'texture signature' })
    @IsNotEmpty()
    @IsString()
    @Column()
    textureSignature: string;

    @ApiPropertyOptional({ description: 'user the skin is equipped to' })
    @ManyToOne(() => UserEntity, (user: UserEntity) => user.textures)
    owner?: UserEntity;
}
