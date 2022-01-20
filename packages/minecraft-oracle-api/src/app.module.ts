import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema, loadAll } from './config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { nestLikeConsoleFormat } from './utils';
import { ProviderModule } from './provider/provider.module';
import { RedisModule } from 'nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextureEntity } from './texture/texture.entity';
import { UserEntity } from './user/user.entity';
import { SnapshotItemEntity } from './snapshot/snapshotItem.entity';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { GameApiModule } from './gameapi/gameapi.module';
import { TextureModule } from './texture/texture.module';
import { MaterialEntity } from './material/material.entity';
import { SnapshotModule } from './snapshot/snapshot.module';
import { MaterialModule } from './material/material.module';
import { AdminModule } from './admin/admin.module';
import { GameModule } from './game/game.module';
import { GameEntity } from './game/game.entity';
import { SecretEntity } from './secret/secret.entity';
import { SecretModule } from './secret/secret.module';
import { OracleModule } from './oracle/oracle.module';
import { AssetModule } from './asset/asset.module';
import { AssetEntity } from './asset/asset.entity';
import { SummonEntity } from './summon/summon.entity';
import { SummonModule } from './summon/summon.module';
import { UserModule } from './user/user.module';
import { ProfileApiModule } from './profileapi/profileapi.module';
import { CronModule } from './cron/cron.module';
import { PlaySessionModule } from './playsession/playsession.module';
import { PlaySessionEntity } from './playsession/playsession.entity';
import { PlaySessionStatEntity } from './playsession/playsessionstat.entity';
import { InventoryModule } from './playerinventory/inventory.module';
import { InventoryEntity } from './playerinventory/inventory.entity';
import { NftModule } from './nft/nft.module';
import { SkinEntity } from './skin/skin.entity';
import { SkinModule } from './skin/skin.module';
import { AchievementEntity } from './achievement/achievement.entity';
import { PlayerAchievementEntity } from './playerachievement/playerachievement.entity';
import { GameTypeEntity } from './gametype/gametype.entity';
import { GameTypeModule } from './gametype/gametype.module';
import { AchievementModule } from './achievement/achievement.module';
import { PlayerAchievementModule } from './playerachievement/playerachievement.module';
import { PlayerScoreEntity } from './playerscore/playerscore.entity';
import { PlayerScoreModule } from './playerscore/playerscore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        envFilePath: ['.env', '.env.ci'],
        isGlobal: true,
        validationSchema: envValidationSchema(),
        load: [loadAll]
    }),
    WinstonModule.forRootAsync({
        useFactory: async (configService: ConfigService) => {
            //console.log(configService.get<string>('typeorm'))
            return {
                level: configService.get<string>('log.level'),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    nestLikeConsoleFormat()
                ),
                transports: [new winston.transports.Console()]
            };
        },
        inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
        useFactory: async (configService: ConfigService) => ({
            type: configService.get<string>('typeorm.connection') as any,
            host: configService.get<string>('typeorm.host'),
            port: configService.get<number>('typeorm.port'),
            username: configService.get<string>('typeorm.username'),
            password: configService.get<string>('typeorm.password'),
            database: configService.get<string>('typeorm.database'),
            entities: [UserEntity, SnapshotItemEntity, InventoryEntity, TextureEntity, SkinEntity, PlayerScoreEntity, MaterialEntity, GameEntity, GameTypeEntity, AchievementEntity, PlayerAchievementEntity, SecretEntity, AssetEntity, SummonEntity, PlaySessionEntity, PlaySessionStatEntity],
            synchronize: configService.get<boolean>('typeorm.synchronize'),
            logging: configService.get<boolean>('typeorm.logging'),
        }),
        inject: [ConfigService]
    }),
    RedisModule.forRootAsync({
        useFactory: (configService: ConfigService) => [
            {
                name: configService.get<string>('redis.name'),
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
                password: configService.get<string>('redis.password'),
                keyPrefix: configService.get<string>('redis.keyPrefix')
            }
        ],
        inject: [ConfigService]
    }),
    PlaySessionModule,
    CronModule,
    ProviderModule,
    CacheModule,
    SecretModule,
    AssetModule,
    UserModule,
    ProfileApiModule,
    AuthModule,
    TextureModule,
    SkinModule,
    MaterialModule,
    SnapshotModule,
    InventoryModule,
    SummonModule,
    AchievementModule,
    PlayerAchievementModule,
    PlayerScoreModule,
    GameModule,
    GameTypeModule,
    GameApiModule,
    AdminModule,
    OracleModule,
    NftModule
  ]
})
export class AppModule {}
