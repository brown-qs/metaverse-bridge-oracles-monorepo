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
import { MinecraftUserModule } from '../user/minecraft-user/minecraft-user.module';
import { ProfileApiController } from './profileapi.controller';
import { ProfileApiService } from './profileapi.service';
import { InventoryModule } from '../playerinventory/inventory.module';
import { SkinModule } from '../skin/skin.module';
import { ResourceInventoryModule } from '../resourceinventory/resourceinventory.module';
import { EmailUserModule } from 'src/user/email-user/email-user.module';

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
        MinecraftUserModule,
        SecretModule,
        TextureModule,
        SkinModule,
        MaterialModule,
        InventoryModule,
        EmailUserModule,
        MinecraftUserModule,
        forwardRef(() => GameApiModule),
        SummonModule,
        ProviderModule,
        ResourceInventoryModule
    ],
    providers: [ProfileApiService],
    exports: [ProfileApiService],
    controllers: [ProfileApiController]
})
export class ProfileApiModule { }
