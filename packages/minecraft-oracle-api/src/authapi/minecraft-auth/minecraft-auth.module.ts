import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MinecraftAuthService } from './minecraft-auth.service';
import { MinecraftAuthController } from './minecraft-auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { UserModule } from '../../user/user/user.module';
import { MicrosoftSetupParamsProvider } from '../../provider';
import { CacheModule } from '../../cache/cache.module';
import { Module } from '@nestjs/common';
import { SecretModule } from '../../secret/secret.module';
import { SkinModule } from '../../skin/skin.module';
import { TextureModule } from '../../texture/texture.module';
import { MinecraftLinkModule } from '../../user/minecraft-link/minecraft-link.module';
import { GameModule } from '../../game/game.module';
import { MinecraftUserNameModule } from '../../user/minecraft-user-name/minecraft-user-name.module';
import { MinecraftUuidModule } from '../../user/minecraft-uuid/minecraft-uuid.module';

@Module({
    imports: [
        MinecraftUserNameModule,
        MinecraftUuidModule,
        GameModule,
        MinecraftLinkModule,
        UserModule,
        SecretModule,
        CacheModule,
        PassportModule,
        TextureModule,
        SkinModule,
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
        })
    ],
    providers: [MicrosoftSetupParamsProvider, MinecraftAuthService, JwtStrategy],
    controllers: [MinecraftAuthController],
    exports: [MinecraftAuthService]
})
export class MinecraftAuthModule { }
