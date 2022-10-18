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
import { UserModule } from '../user/user/user.module';
import { AdminApiController } from './adminapi.controller';
import { AdminApiService } from './adminapi.service';
import { CqrsModule } from '@nestjs/cqrs';
import { AssetModule } from '../asset/asset.module';
import { NftApiModule } from '../nftapi/nftapi.module';

@Module({
    imports: [
        NftApiModule,
        AssetModule,
        CqrsModule,
        MaterialModule,
        SecretModule,
        UserModule,
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
export class AdminApiModule { }
