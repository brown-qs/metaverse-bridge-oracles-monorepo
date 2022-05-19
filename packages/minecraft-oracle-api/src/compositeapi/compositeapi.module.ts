import { forwardRef, Module } from '@nestjs/common';
import { CollectionFragmentModule } from '../collectionfragment/collectionfragment.module';
import { AssetModule } from '../asset/asset.module';
import { CollectionModule } from '../collection/collection.module';
import { CompositeAssetModule } from '../compositeasset/compositeasset.module';
import { CompositeCollectionFragmentModule } from '../compositecollectionfragment/compositecollectionfragment.module';
import { NftApiModule } from '../nftapi/nftapi.module';
import { UserModule } from '../user/user.module';
import { CompositeApiService } from './compositeapi.service';
import { CompositeApiController } from './compositeapi.controller';
import { SyntheticPartModule } from '../syntheticpart/syntheticpart.module';
import { SyntheticItemModule } from '../syntheticitem/syntheticitem.module';

@Module({
    imports: [
        UserModule,
        AssetModule,
        CollectionModule,
        CompositeCollectionFragmentModule,
        CompositeAssetModule,
        CollectionFragmentModule,
        SyntheticPartModule,
        SyntheticItemModule,
        NftApiModule
    ],
    providers: [CompositeApiService],
    exports: [CompositeApiService],
    controllers: [CompositeApiController]
})
export class CompositeApiModule {}