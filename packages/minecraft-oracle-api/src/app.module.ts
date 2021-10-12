import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { GameModule } from './game/game.module';
import { TextureModule } from './texture/texture.module';
import { MaterialEntity } from './material/material.entity';
import { SnapshotModule } from './snapshot/snapshot.module';
import { MaterialModule } from './material/material.module';
import { AdminModule } from './admin/admin.module';

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
            console.log(configService.get<string>('typeorm'))
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
            entities: [UserEntity, SnapshotItemEntity, TextureEntity, MaterialEntity],
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
    ProviderModule,
    CacheModule,
    AuthModule,
    TextureModule,
    MaterialModule,
    SnapshotModule,
    GameModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
