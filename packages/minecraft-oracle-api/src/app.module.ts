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
import { ItemEntity } from './item/item.entity';
import { SkinEntity } from './skin/skin.entity';
import { UserEntity } from './user/user.entity';
import { SnapshotItemEntity } from './snapshot/snapshotItem';

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
            type: 'postgres',
            host: configService.get<string>('db.host'),
            port: configService.get<number>('db.port'),
            username: configService.get<string>('db.user'),
            password: configService.get<string>('db.password'),
            database: configService.get<string>('db.name'),
            entities: [UserEntity, SnapshotItemEntity, ItemEntity, SkinEntity],
            synchronize: true // ToDo: later change to migrations
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
    ProviderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
