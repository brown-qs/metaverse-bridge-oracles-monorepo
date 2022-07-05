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
import { UserEntity } from './user/user/user.entity';
import { SnapshotItemEntity } from './snapshot/snapshotItem.entity';
import { CacheModule } from './cache/cache.module';
import { GameApiModule } from './gameapi/gameapi.module';
import { TextureModule } from './texture/texture.module';
import { MaterialEntity } from './material/material.entity';
import { SnapshotModule } from './snapshot/snapshot.module';
import { MaterialModule } from './material/material.module';
import { AdminApiModule } from './adminapi/adminapi.module';
import { GameModule } from './game/game.module';
import { GameEntity } from './game/game.entity';
import { SecretEntity } from './secret/secret.entity';
import { SecretModule } from './secret/secret.module';
import { OracleApiModule } from './oracleapi/oracleapi.module';
import { AssetModule } from './asset/asset.module';
import { AssetEntity } from './asset/asset.entity';
import { SummonEntity } from './summon/summon.entity';
import { SummonModule } from './summon/summon.module';
import { UserModule } from './user/user/user.module';
import { ProfileApiModule } from './profileapi/profileapi.module';
import { CronModule } from './cron/cron.module';
import { PlaySessionModule } from './playsession/playsession.module';
import { PlaySessionEntity } from './playsession/playsession.entity';
import { PlaySessionStatEntity } from './playsession/playsessionstat.entity';
import { InventoryModule } from './playerinventory/inventory.module';
import { InventoryEntity } from './playerinventory/inventory.entity';
import { NftApiModule } from './nftapi/nftapi.module';
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
import { GganbuModule } from './gganbu/gganbu.module';
import { GganbuEntity } from './gganbu/gganbu.entity';
import { SnaplogModule } from './snaplog/snaplog.module';
import { SnaplogEntity } from './snaplog/snaplog.entity';
import { GameScoreTypeEntity } from './gamescoretype/gamescoretype.entity';
import { GameItemTypeEntity } from './gameitemtype/gameitemtype.entity';
import { PlayerGameItemEntity } from './playergameitem/playergameitem.entity';
import { ChainEntity } from './chain/chain.entity';
import { ChainModule } from './chain/chain.module';
import { CollectionEntity } from './collection/collection.entity';
import { CollectionFragmentEntity } from './collectionfragment/collectionfragment.entity';
import { CompositeCollectionFragmentEntity } from './compositecollectionfragment/compositecollectionfragment.entity';
import { CompositeAssetEntity } from './compositeasset/compositeasset.entity';
import { CollectionModule } from './collection/collection.module';
import { CompositeAssetModule } from './compositeasset/compositeasset.module';
import { CollectionFragmentModule } from './collectionfragment/collectionfragment.module';
import { CompositeCollectionFragmentModule } from './compositecollectionfragment/compositecollectionfragment.module';
import { CompositeApiModule } from './compositeapi/compositeapi.module';
import { CompositePartEntity } from './compositepart/compositepart.entity';
import { CompositePartModule } from './compositepart/compositepart.module';
import { SyntheticPartModule } from './syntheticpart/syntheticpart.module';
import { SyntheticPartEntity } from './syntheticpart/syntheticpart.entity';
import { SyntheticItemEntity } from './syntheticitem/syntheticitem.entity';
import { SyntheticItemModule } from './syntheticitem/syntheticitem.module';
import { ResourceInventoryEntity } from './resourceinventory/resourceinventory.entity';
import { ResourceInventoryModule } from './resourceinventory/resourceinventory.module';
import { ResourceInventoryOffsetEntity } from './resourceinventoryoffset/resourceinventoryoffset.entity';
import { ResourceInventoryOffsetModule } from './resourceinventoryoffset/resourceinventoryoffset.module';
import { EmailAuthModule } from './authapi/email-auth/email-auth.module';
import { KiltAuthModule } from './authapi/kilt-auth/kilt-auth.module';
import { MinecraftAuthModule } from './authapi/minecraft-auth/minecraft-auth.module';
import { EmailLoginKeyEntity } from './user/email-login-key/email-login-key.entity';
import { EmailLoginKeyModule } from './user/email-login-key/email-login-key.module';
import { MinecraftUuidUserNameEntity } from './user/minecraft-uuid-user-name/minecraft-uuid-user-name.entity';
import { MinecraftUuidUserNameModule } from './user/minecraft-uuid-user-name/minecraft-uuid-user-name.module';
import { EmailChangeModule } from './user/email-change/email-change.module';
import { MinecraftLinkModule } from './user/minecraft-link/minecraft-link.module';
import { MinecraftLinkEntity } from './user/minecraft-link/minecraft-link.entity';
import { EmailChangeEntity } from './user/email-change/email-change.entity';
import { UserAssetView } from './views';
import { KiltSessionEntity } from './user/kilt-session/kilt-session.entity';
import { KiltSessionModule } from './user/kilt-session/kilt-session.module';
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
                entities: [
                    EmailChangeEntity,
                    MinecraftLinkEntity,
                    MinecraftUuidUserNameEntity,
                    KiltSessionEntity,
                    EmailLoginKeyEntity,
                    UserEntity,
                    SnapshotItemEntity,
                    InventoryEntity,
                    TextureEntity,
                    SkinEntity,
                    PlayerScoreEntity,
                    MaterialEntity,
                    GameEntity,
                    GameTypeEntity,
                    AchievementEntity,
                    PlayerAchievementEntity,
                    SecretEntity,
                    AssetEntity,
                    SummonEntity,
                    PlaySessionEntity,
                    PlaySessionStatEntity,
                    GganbuEntity,
                    SnaplogEntity,
                    GameItemTypeEntity,
                    PlayerGameItemEntity,
                    GameScoreTypeEntity,
                    ChainEntity,
                    CollectionEntity,
                    CollectionFragmentEntity,
                    CompositeCollectionFragmentEntity,
                    CompositeAssetEntity,
                    CompositePartEntity,
                    SyntheticPartEntity,
                    SyntheticItemEntity,
                    ResourceInventoryEntity,
                    ResourceInventoryOffsetEntity,
                    UserAssetView
                ],
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
        EmailChangeModule,
        MinecraftLinkModule,
        MinecraftUuidUserNameModule,
        PlaySessionModule,
        CronModule,
        ProviderModule,
        CacheModule,
        SecretModule,
        AssetModule,
        EmailLoginKeyModule,
        UserModule,
        ProfileApiModule,
        KiltAuthModule,
        EmailAuthModule,
        MinecraftAuthModule,
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
        AdminApiModule,
        OracleApiModule,
        NftApiModule,
        GganbuModule,
        SnaplogModule,
        ChainModule,
        CollectionModule,
        CollectionFragmentModule,
        CompositeCollectionFragmentModule,
        CompositeAssetModule,
        CompositePartModule,
        SyntheticPartModule,
        SyntheticItemModule,
        ResourceInventoryModule,
        ResourceInventoryOffsetModule,
        CompositeApiModule,
        KiltSessionModule,
    ],
    controllers: [],
    providers: []
})
export class AppModule { }
