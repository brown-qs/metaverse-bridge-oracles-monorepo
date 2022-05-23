import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AssetModule } from '../asset/asset.module';
import { GameApiModule } from '../gameapi/gameapi.module';
import { ProviderModule } from '../provider/provider.module';
import { SecretModule } from '../secret/secret.module';
import { SummonModule } from '../summon/summon.module';
import { MaterialModule } from '../material/material.module';
import { TextureModule } from '../texture/texture.module';
import { UserModule } from '../user/user.module';
import { ProfileApiController } from './profileapi.controller';
import { ProfileApiService } from './profileapi.service';
import { InventoryModule } from '../playerinventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { ResourceInventoryModule } from '../resourceinventory/resourceinventory.module';

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
        SkinModule,
        MaterialModule,
        InventoryModule,
        forwardRef(() => GameApiModule),
        SummonModule,
        ProviderModule,
        ResourceInventoryModule
    ],
    providers: [ProfileApiService],
    exports: [ProfileApiService],
    controllers: [ProfileApiController]
})
export class ProfileApiModule {}
