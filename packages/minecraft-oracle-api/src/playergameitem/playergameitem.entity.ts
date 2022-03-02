import {
    IsBoolean,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { GameEntity } from 'src/game/game.entity';
import { GameItemTypeEntity } from 'src/gameitemtype/gameitemtype.entity';

@Entity()
@Index(['id'], {unique: true})
export class PlayerGameItemEntity {

    constructor(item: Partial<PlayerGameItemEntity>) {
        Object.assign(this, item);
    }

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    @IsString()
    amount: string;

    @Column({ type: 'bigint' })
    @IsString()
    updatedAt: string;

    @Column()
    @IsString()
    itemId: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
    game: GameEntity;

    @ManyToOne(() => UserEntity, (user) => user.achievements)
    player: UserEntity;
    
}
