import { forwardRef, Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { PlaySessionModule } from '../playsession/playsession.module';
import { SecretModule } from '../secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { GameApiController } from './gameapi.controller';
import { GameApiService } from './gameapi.service';
import { InventoryModule } from '../playerinventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { AssetModule } from '../asset/asset.module';
import { ProviderModule } from '../provider/provider.module';
import { ProfileApiModule } from '../profileapi/profileapi.module';
import { GameTypeModule } from '../gametype/gametype.module';
import { AchievementModule } from '../achievement/achievement.module';
import { PlayerAchievementModule } from '../playerachievement/playerachievement.module';
import { PlayerScoreModule } from '../playerscore/playerscore.module';
import { SnaplogModule } from '../snaplog/snaplog.module';
import { GganbuModule } from '../gganbu/gganbu.module';
import { GameScoreTypeModule } from 'src/gamescoretype/gamescoretype.module';


@Module({
    imports: [
        UserModule,
        SecretModule,
        TextureModule,
        SkinModule,
        MaterialModule,
        SnapshotModule,
        SnaplogModule,
        GganbuModule,
        InventoryModule,
        GameModule,
        GameTypeModule,
        AchievementModule,
        PlayerAchievementModule,
        PlayerScoreModule,
        PlaySessionModule,
        GameScoreTypeModule,
        forwardRef(() => ProfileApiModule),
        AssetModule,
        ProviderModule
    ],
    providers: [GameApiService],
    exports: [GameApiService],
    controllers: [GameApiController]
})
export class GameApiModule {}
