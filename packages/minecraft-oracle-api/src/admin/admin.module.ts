import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { MaterialModule } from 'src/material/material.module';
import { OracleModule } from 'src/oracle/oracle.module';
import { ProfileModule } from 'src/profile/profile.module';
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
        UserModule,
        ProfileModule,
        GameModule,
        TextureModule,
        SnapshotModule,
        OracleModule
    ],
    providers: [AdminService],
    exports: [AdminService],
    controllers: [AdminController]
})
export class AdminModule {}
