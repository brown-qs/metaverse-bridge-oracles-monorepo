import { Module } from '@nestjs/common';
import { GameSessionModule } from '../gamesession/gamesession.module';
import { PlaySessionModule } from '../playsession/playsession.module';
import { ProfileModule } from '../profile/profile.module';
import { SecretModule } from '../secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { InventoryModule } from '../inventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { AssetModule } from '../asset/asset.module';
import { ProviderModule } from '../provider/provider.module';

@Module({
    imports: [
        UserModule,
        ProfileModule,
        SecretModule,
        TextureModule,
        SkinModule,
        MaterialModule,
        SnapshotModule,
        InventoryModule,
        GameSessionModule,
        PlaySessionModule,
        AssetModule,
        ProviderModule
    ],
    providers: [GameService],
    exports: [GameService],
    controllers: [GameController]
})
export class GameModule {}
