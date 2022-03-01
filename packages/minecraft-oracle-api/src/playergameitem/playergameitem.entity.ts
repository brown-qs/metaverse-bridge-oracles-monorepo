import {
    IsBoolean,
    IsNumber,
    IsString
} from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { GameEntity } from 'src/game/game.entity';

@Entity()
@Index(['id'], {unique: true})
export class PlayerGameItemEntity {

    constructor(item: Partial<PlayerGameItemEntity>) {
        Object.assign(this, item);
    }

    @PrimaryColumn()
    @IsString()
    id: string;

    @Column()
    @IsString()
    amount: string;

    @Column({ type: 'bigint' })
    @IsString()
    updatedAt: string;

    @ManyToOne(() => GameEntity, (game) => game.achievements)
    game: GameEntity;

    @ManyToOne(() => UserEntity, (user) => user.achievements)
    player: UserEntity;
    
}
