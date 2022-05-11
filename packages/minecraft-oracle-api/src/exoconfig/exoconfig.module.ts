import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoonsamaApiService } from './exoconfig.service';
import { MoonsamaAPIController } from './exoconfig.controller';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';
import { ConfigEntity } from './config.entity';
@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([ConfigEntity])),
        ProviderModule,
        SecretModule
    ],
    providers: [MoonsamaApiService],
    exports: [MoonsamaApiService],
    controllers: [MoonsamaAPIController]
})
export class MoonsamaApiModule {}
