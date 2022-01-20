import { Module } from '@nestjs/common';
import { GameApiModule } from '../gameapi/gameapi.module';
import { MaterialModule } from '../material/material.module';
import { OracleModule } from '../oracle/oracle.module';
import { ProfileApiModule } from '../profileapi/profileapi.module';
import { SecretModule } from '../secret/secret.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [
        MaterialModule,
        SecretModule,
        UserModule,
        ProfileApiModule,
        GameApiModule,
        TextureModule,
        SnapshotModule,
        OracleModule
    ],
    providers: [AdminService],
    exports: [AdminService],
    controllers: [AdminController]
})
export class AdminModule {}
