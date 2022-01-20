import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { GameModule } from '../game/game.module';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';
import { SummonModule } from '../summon/summon.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { OracleApiController } from './oracleapi.controller';
import { OracleApiService } from './oracleapi.service';
import { InventoryModule } from '../playerinventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { NftApiModule } from '../nftapi/nftapi.module';

@Module({
    imports: [
        AssetModule,
        UserModule,
        SecretModule,
        TextureModule,
        SkinModule,
        InventoryModule,
        GameModule,
        SummonModule,
        ProviderModule,
        NftApiModule
    ],
    providers: [OracleApiService],
    exports: [OracleApiService],
    controllers: [OracleApiController]
})
export class OracleApiModule {}
