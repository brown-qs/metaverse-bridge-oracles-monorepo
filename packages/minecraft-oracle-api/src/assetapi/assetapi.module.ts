import { Module } from '@nestjs/common';
import { ResourceInventoryModule } from '../resourceinventory/resourceinventory.module';
import { AssetModule } from '../asset/asset.module';
import { UserModule } from '../user/user/user.module';
import { AssetApiService } from './assetapi.service';
import { ResourceInventoryOffsetModule } from '../resourceinventoryoffset/resourceinventoryoffset.module';
import { CollectionFragmentModule } from '../collectionfragment/collectionfragment.module';
import { AssetApiController } from './assetapi.controller';
import { SecretModule } from '../secret/secret.module';
import { ProfileApiModule } from '../profileapi/profileapi.module';
import { GameApiModule } from '../gameapi/gameapi.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        CqrsModule,
        ProfileApiModule,
        GameApiModule,
        SecretModule,
        UserModule,
        AssetModule,
        ResourceInventoryModule,
        ResourceInventoryOffsetModule,
        CollectionFragmentModule
    ],
    providers: [AssetApiService],
    exports: [AssetApiService],
    controllers: [AssetApiController]
})
export class AssetApiModule { }
