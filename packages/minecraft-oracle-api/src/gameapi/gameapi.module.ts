import { forwardRef, Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { PlaySessionModule } from '../playsession/playsession.module';
import { SecretModule } from '../secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { MinecraftUserModule } from '../user/minecraft-user/minecraft-user.module';
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
import { GameScoreTypeModule } from '../gamescoretype/gamescoretype.module';

import { GameItemTypeModule } from '../gameitemtype/gameitemtype.module';
import { PlayerGameItemModule } from '../playergameitem/playergameitem.module';
import { ResourceInventoryModule } from '../resourceinventory/resourceinventory.module';
import { ResourceInventoryOffsetModule } from '../resourceinventoryoffset/resourceinventoryoffset.module';
import { CollectionFragmentModule } from '../collectionfragment/collectionfragment.module';

@Module({
    imports: [
        MinecraftUserModule,
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
        ProviderModule,
        GameItemTypeModule,
        PlayerGameItemModule,
        ResourceInventoryModule,
        ResourceInventoryOffsetModule,
        CollectionFragmentModule
    ],
    providers: [GameApiService],
    exports: [GameApiService],
    controllers: [GameApiController]
})
export class GameApiModule {}
