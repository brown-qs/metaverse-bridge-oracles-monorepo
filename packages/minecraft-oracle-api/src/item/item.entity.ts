import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { AssetType } from 'src/common/enums/AssetType';

@Entity()
@Index(['name'], {unique: true})
export class ItemEntity {

    constructor(item: Partial<ItemEntity>) {
        Object.assign(this, item);
    }

    @ApiProperty({ description: 'Name of the item object. Unique.'})
    @PrimaryColumn()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Ordinal of the enum Material object in Minecraft'})
    @Column({nullable: true})
    @IsNumber()
    ordinal?: number;

    @ApiPropertyOptional({ description: 'Hash code of the enum Material object in Minecraft'})
    @Column({nullable: true})
    @IsNumber()
    hashCode: number;

    @ApiProperty({ description: 'Asset type (ERC standard) of the on-chain asset this material belongs to.'})
    @Column()
    @IsEnum(AssetType)
    @Column({
        type: 'enum',
        enum: AssetType,
        default: AssetType.NONE
    })
    assetType: AssetType;

    @ApiProperty({ description: 'Ethereum address of the on-chain asset this material belongs to.'})
    @Column()
    @IsString()
    assetAddress: string;

    @ApiProperty({ description: 'Token ID of the on-chain asset this material belongs to. In case of ERC20 it is 0.'})
    @Column()
    @IsString()
    assetTokenId: string;

    @ApiProperty({ description: 'Whether the item can be snapshotted (a.k.a saved) from the game'})
    @IsBoolean()
    @Column()
    snapshottable: boolean;
    
    @ApiProperty({ description: 'Whether the item can be imported from an ERC token into the game'})
    @IsBoolean()
    @Column()
    importable: boolean;

    @ApiProperty({ description: 'Whether the item can be exported as an ERC token to the chain'})
    @IsBoolean()
    @Column()
    exportable: boolean;

    @ApiProperty({ description: 'Max stack size of the item'})
    @IsNumber()
    @Column()
    maxStackSize: number;
}
