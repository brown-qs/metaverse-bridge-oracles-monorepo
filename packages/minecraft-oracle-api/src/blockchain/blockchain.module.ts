import { Module } from '@nestjs/common';
import { GameSessionModule } from 'src/gamesession/gamesession.module';
import { SecretModule } from 'src/secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';

@Module({
    imports: [
        UserModule,
        SecretModule,
        TextureModule,
        MaterialModule,
        SnapshotModule,
        GameSessionModule
    ],
    providers: [BlockchainService],
    exports: [BlockchainService],
    controllers: [BlockchainController]
})
export class BlockchainModule {}
