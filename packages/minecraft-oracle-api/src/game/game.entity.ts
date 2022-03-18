import {
    IsBoolean, IsEnum, IsString,
} from 'class-validator';
import { AchievementEntity } from '../achievement/achievement.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { GameTypeEntity } from '../gametype/gametype.entity';
import { GameKind } from './game.enum';
import { PlayerScoreEntity } from '../playerscore/playerscore.entity';
import { PlaySessionEntity } from '../playsession/playsession.entity';
import { GganbuEntity } from '../gganbu/gganbu.entity';
import { SnapshotItemEntity } from '../snapshot/snapshotItem.entity';
import { SnaplogEntity } from '../snaplog/snaplog.entity';
import { PlaySessionStatEntity } from '../playsession/playsessionstat.entity';
import { GameItemTypeEntity } from '../gameitemtype/gameitemtype.entity';
import { PlayerGameItemEntity } from '../playergameitem/playergameitem.entity';
import { GameScoreTypeEntity } from '../gamescoretype/gamescoretype.entity';


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

    @Column({ nullable: true })
    @IsString()
    name?: string;

    @Column({ nullable: true })
    @IsString()
    description?: string;

    @Column({ nullable: true })
    @IsString()
    image?: string;

    @Column({type: "bigint"})
    @IsString()
    startedAt: string;

    @Column({ type: "bigint", nullable: true })
    @IsString()
    endedAt?: string;

    @Column({ nullable: true })
    @IsString()
    serverAddress?: string;

    @Column({ nullable: true })
    @IsString()
    state?: string;
  

    @OneToMany(() => AchievementEntity, (achievement) => achievement.game)
    achievements?: AchievementEntity[];

    @OneToMany(() => PlayerScoreEntity, (playerScore) => playerScore.game)
    playerScores?: PlayerScoreEntity[];

    @OneToMany(() => PlaySessionEntity, (playSession) => playSession.game)
    playSessions?: PlaySessionEntity[];

    @ManyToOne(() => GameTypeEntity, (gameType) => gameType.games)
    gameType: GameTypeEntity;

    @OneToMany(() => GganbuEntity, (gganbu) => gganbu.game)
    gganbus?: GganbuEntity[];

    @OneToMany(() => SnapshotItemEntity, (snapshot) => snapshot.game)
    snapshots?: SnapshotItemEntity[];

    @OneToMany(() => SnaplogEntity, (snaplog) => snaplog.game)
    snaplogs?: SnaplogEntity[];

    @OneToMany(() => PlaySessionStatEntity, (playSessionStat) => playSessionStat.game)
    playSessionStats?: PlaySessionStatEntity[]

    @OneToMany(() => GameItemTypeEntity, (gameItemType) => gameItemType.game)
    gameItemTypes?: GameItemTypeEntity[];

    @OneToMany(() => PlayerGameItemEntity, (playerGameItem) => playerGameItem.game)
    playerGameItems?: PlayerGameItemEntity[];

    @OneToMany(() => GameScoreTypeEntity, (gameScoreType) => gameScoreType.game)
    gameScoreTypes?: GameScoreTypeEntity[];
}
