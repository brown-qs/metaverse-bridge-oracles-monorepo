import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';
import { GameEntity } from '../game/game.entity';

@Entity()
@Index(['id'], {unique: true})
export class PlayerGameItemEntity {

    constructor(item: Partial<PlayerGameItemEntity>) {
        Object.assign(this, item);
    }

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'bigint' })
    amount: string;

    @Column({ type: 'bigint' })
    updatedAt: string;

    @Column()
    itemId: string;

    @ManyToOne(() => GameEntity, (game) => game.playerGameItems)
    game: GameEntity;

    @ManyToOne(() => MinecraftUserEntity, (user) => user.playerGameItems)
    player: MinecraftUserEntity;
}
