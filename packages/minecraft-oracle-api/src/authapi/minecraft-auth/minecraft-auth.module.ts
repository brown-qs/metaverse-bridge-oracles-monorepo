import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MinecraftAuthService } from './minecraft-auth.service';
import { MicrosoftAuthController } from './minecraft-auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { MinecraftUserModule } from '../../user/minecraft-user/minecraft-user.module';
import { MicrosoftSetupParamsProvider } from '../../provider';
import { CacheModule } from '../../cache/cache.module';
import { Module } from '@nestjs/common';
import { SecretModule } from '../../secret/secret.module';
import { SkinModule } from '../../skin/skin.module';
import { TextureModule } from '../../texture/texture.module';

@Module({
    imports: [
        MinecraftUserModule,
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
    controllers: [MicrosoftAuthController],
    exports: [MinecraftAuthService]
})
export class MicrosoftAuthModule { }
