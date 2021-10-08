import {
    IsNumber,
    IsString
} from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ItemEntity } from 'src/item/item.entity';

@Entity()
@Index(['id'], {unique: true})
export class SnapshotItemEntity {

    constructor(snapshotItem: Partial<SnapshotItemEntity>) {
        Object.assign(this, snapshotItem);
    }

    @PrimaryGeneratedColumn("uuid")
    @IsString()
    id: string;

    @ApiProperty({ description: 'Amount the player has'})
    @Column()
    @IsNumber()
    amount: number;
    
    @ApiProperty({ description: 'The item this belongs to'})
    @ManyToOne(() => ItemEntity)
    @JoinColumn()
    item: ItemEntity;

    @ApiProperty({ description: 'User this item belongs to'})
    @ManyToOne(() => UserEntity, (user) => user.snapshotItems)
    owner: UserEntity;
}
