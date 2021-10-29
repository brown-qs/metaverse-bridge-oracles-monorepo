import { Module } from '@nestjs/common';
import { GameSessionModule } from 'src/gamesession/gamesession.module';
import { ProfileModule } from 'src/profile/profile.module';
import { SecretModule } from 'src/secret/secret.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
    imports: [
        UserModule,
        ProfileModule,
        SecretModule,
        TextureModule,
        MaterialModule,
        SnapshotModule,
        GameSessionModule
    ],
    providers: [GameService],
    exports: [GameService],
    controllers: [GameController]
})
export class GameModule {}
