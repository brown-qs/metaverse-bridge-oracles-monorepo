import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';

@Module({
    imports: [
        ProviderModule,
        SecretModule
    ],
    providers: [NftService],
    exports: [NftService],
    controllers: [NftController]
})
export class NftModule {}
