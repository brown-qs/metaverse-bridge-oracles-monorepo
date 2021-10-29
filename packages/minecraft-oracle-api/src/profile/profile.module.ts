import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AssetModule } from 'src/asset/asset.module';
import { GameSessionModule } from 'src/gamesession/gamesession.module';
import { ProviderModule } from 'src/provider/provider.module';
import { SecretModule } from 'src/secret/secret.module';
import { SummonModule } from 'src/summon/summon.module';
import { MaterialModule } from '../material/material.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                const expiration = configService.get<number>('jwt.expiration')
                const secret = configService.get<string>('jwt.secret')
                return {
                    secret: secret,
                    signOptions: { expiresIn: expiration }
                }
            },
            inject: [ConfigService]
        }),
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
    providers: [ProfileService],
    exports: [ProfileService],
    controllers: [ProfileController]
})
export class ProfileModule {}
