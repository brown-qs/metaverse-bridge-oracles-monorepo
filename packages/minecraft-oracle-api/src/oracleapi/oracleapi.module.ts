import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { GameModule } from '../game/game.module';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';
import { SummonModule } from '../summon/summon.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user/user.module';
import { OracleApiController } from './oracleapi.controller';
import { OracleApiService } from './oracleapi.service';
import { InventoryModule } from '../playerinventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { NftApiModule } from '../nftapi/nftapi.module';
import { ChainModule } from '../chain/chain.module';
import { CollectionFragmentModule } from '../collectionfragment/collectionfragment.module';
import { CompositeApiModule } from '../compositeapi/compositeapi.module';
import { CompositeAssetModule } from '../compositeasset/compositeasset.module';
import { MaterialModule } from '../material/material.module';
import { ResourceInventoryModule } from '../resourceinventory/resourceinventory.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CollectionFragmentRoutingModule } from '../collectionfragmentrouting/collectionfragmentrouting.module';
import { SummonLogModule } from '../summon-log/summon-log.module';
import { InLogModule } from '../in-log/in-log.module';
import { MigrationLogModule } from '../migration-log/migration-log.module';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
    imports: [
        CaptchaModule,
        SummonLogModule,
        InLogModule,
        MigrationLogModule,
        CollectionFragmentRoutingModule,
        CqrsModule,
        AssetModule,
        UserModule,
        SecretModule,
        MaterialModule,
        TextureModule,
        SkinModule,
        InventoryModule,
        GameModule,
        SummonModule,
        ProviderModule,
        NftApiModule,
        ChainModule,
        CollectionFragmentModule,
        CompositeApiModule,
        CompositeAssetModule,
        ResourceInventoryModule
    ],
    providers: [OracleApiService],
    exports: [OracleApiService],
    controllers: [OracleApiController]
})
export class OracleApiModule { }
