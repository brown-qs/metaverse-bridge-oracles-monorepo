import { Module } from '@nestjs/common';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
    imports: [
        UserModule,
        TextureModule,
        MaterialModule,
        SnapshotModule
    ],
    providers: [GameService],
    exports: [GameService],
    controllers: [GameController]
})
export class GameModule {}
