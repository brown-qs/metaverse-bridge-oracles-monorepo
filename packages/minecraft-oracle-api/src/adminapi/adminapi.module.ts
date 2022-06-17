import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameTypeModule } from '../gametype/gametype.module';
import { GameApiModule } from '../gameapi/gameapi.module';
import { MaterialModule } from '../material/material.module';
import { OracleApiModule } from '../oracleapi/oracleapi.module';
import { ProfileApiModule } from '../profileapi/profileapi.module';
import { SecretModule } from '../secret/secret.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { MinecraftUserModule } from '../user/minecraft-user/minecraft-user.module';
import { AdminApiController } from './adminapi.controller';
import { AdminApiService } from './adminapi.service';

@Module({
    imports: [
        MaterialModule,
        SecretModule,
        MinecraftUserModule,
        ProfileApiModule,
        GameApiModule,
        GameTypeModule,
        GameModule,
        TextureModule,
        SnapshotModule,
        OracleApiModule
    ],
    providers: [AdminApiService],
    exports: [AdminApiService],
    controllers: [AdminApiController]
})
export class AdminApiModule {}
