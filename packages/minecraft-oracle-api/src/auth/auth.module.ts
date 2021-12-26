import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { MicrosoftSetupParamsProvider } from '../provider';
import { CacheModule } from '../cache/cache.module';
import { Module } from '@nestjs/common';
import { SecretModule } from '../secret/secret.module';
import { SkinModule } from '../skin/skin.module';
import { TextureModule } from '../texture/texture.module';

@Module({
    imports: [
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
    providers: [MicrosoftSetupParamsProvider, AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
