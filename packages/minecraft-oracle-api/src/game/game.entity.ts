import {
    IsBoolean, IsEnum, IsString,
} from 'class-validator';
import { AchievementEntity } from '../achievement/achievement.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { GameTypeEntity } from 'src/gametype/gametype.entity';
import { GameKind } from './game.enum';
import { PlayerScoreEntity } from 'src/playerscore/playerscore.entity';


@Entity()
export class GameEntity {

    constructor(entity: Partial<GameEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryColumn({unique: true})
    id: string;

    @Column({ nullable: true, default: false })
    @IsBoolean()
    ongoing?: boolean;

    @IsEnum(GameKind)
    @Column({
        type: 'enum',
        enum: GameKind,
        nullable: false
    })
    type: GameKind;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    description: string;

    @Column()
    @IsString()
    image: string;

    @Column({type: "bigint"})
    @IsString()
    startedAt: string;

    @Column({ type: "bigint", nullable: true })
    @IsString()
    endedAt?: string;

    @OneToMany(() => AchievementEntity, (achievement) => achievement.game)
    achievements?: AchievementEntity[];

    @OneToMany(() => PlayerScoreEntity, (playerScore) => playerScore.game)
    playerScores?: PlayerScoreEntity[];

    @ManyToOne(() => GameTypeEntity, (gameType) => gameType.games)
    gameType: GameTypeEntity;
}
