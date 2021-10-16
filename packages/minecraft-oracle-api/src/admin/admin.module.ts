import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { MaterialModule } from 'src/material/material.module';
import { SecretModule } from 'src/secret/secret.module';
import { SnapshotModule } from 'src/snapshot/snapshot.module';
import { TextureModule } from 'src/texture/texture.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [
        MaterialModule,
        SecretModule,
        GameModule,
        TextureModule,
        SnapshotModule,
        UserModule
    ],
    providers: [AdminService],
    exports: [AdminService],
    controllers: [AdminController]
})
export class AdminModule {}
