import { Module } from '@nestjs/common';
import { NftApiService } from './nftapi.service';
import { NftApiController } from './nftapi.controller';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';

@Module({
    imports: [
        ProviderModule,
        SecretModule
    ],
    providers: [NftApiService],
    exports: [NftApiService],
    controllers: [NftApiController]
})
export class NftApiModule {}
