import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { GameSessionModule } from '../gamesession/gamesession.module';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';
import { SummonModule } from '../summon/summon.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { OracleController } from './oracle.controller';
import { OracleService } from './oracle.service';
import { InventoryModule } from '../inventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { NftModule } from '../nft/nft.module';

@Module({
    imports: [
        AssetModule,
        UserModule,
        SecretModule,
        TextureModule,
        SkinModule,
        InventoryModule,
        GameSessionModule,
        SummonModule,
        ProviderModule,
        NftModule
    ],
    providers: [OracleService],
    exports: [OracleService],
    controllers: [OracleController]
})
export class OracleModule {}
