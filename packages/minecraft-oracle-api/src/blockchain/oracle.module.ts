import { Module } from '@nestjs/common';
import { GameSessionModule } from 'src/gamesession/gamesession.module';
import { SecretModule } from 'src/secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { OracleController } from './oracle.controller';
import { OracleService } from './oracle.service';

@Module({
    imports: [
        UserModule,
        SecretModule,
        TextureModule,
        MaterialModule,
        SnapshotModule,
        GameSessionModule
    ],
    providers: [OracleService],
    exports: [OracleService],
    controllers: [OracleController]
})
export class OracleModule {}
