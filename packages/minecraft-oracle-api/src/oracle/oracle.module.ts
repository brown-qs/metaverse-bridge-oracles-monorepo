import { Module } from '@nestjs/common';
import { AssetModule } from 'src/asset/asset.module';
import { GameSessionModule } from 'src/gamesession/gamesession.module';
import { ProviderModule } from 'src/provider/provider.module';
import { SecretModule } from 'src/secret/secret.module';
import { SummonModule } from 'src/summon/summon.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { OracleController } from './oracle.controller';
import { OracleService } from './oracle.service';

@Module({
    imports: [
        AssetModule,
        UserModule,
        SecretModule,
        TextureModule,
        MaterialModule,
        SnapshotModule,
        GameSessionModule,
        SummonModule,
        ProviderModule
    ],
    providers: [OracleService],
    exports: [OracleService],
    controllers: [OracleController]
})
export class OracleModule {}
