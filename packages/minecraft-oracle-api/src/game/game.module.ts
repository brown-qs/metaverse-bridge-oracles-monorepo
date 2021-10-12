import { Module } from '@nestjs/common';
import { MaterialModule } from 'src/material/material.module';
import { SnapshotModule } from 'src/snapshot/snapshot.module';
import { TextureModule } from 'src/texture/texture.module';
import { UserModule } from 'src/user/user.module';
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
