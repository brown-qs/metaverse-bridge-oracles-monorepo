import {
    IsEnum,
    IsNotEmpty,
    IsString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AssetType } from 'src/common/enums/AssetType';

@Entity()
@Index(['assetType', 'assetAddress', 'assetTokenId'], {unique: true})
export class SkinEntity {
    constructor(skin: Partial<SkinEntity>) {
        Object.assign(this, skin);
    }

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
    assetTokenId: string;

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
    @OneToOne(() => UserEntity, (user: UserEntity) => user.skin)
    owner?: UserEntity;
}
