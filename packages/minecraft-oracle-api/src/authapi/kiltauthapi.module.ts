import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthApiService } from './authapi.service';
import { KiltAuthApiController } from './kiltauth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { MicrosoftSetupParamsProvider } from '../provider';
import { CacheModule } from '../cache/cache.module';
import { Module } from '@nestjs/common';
import { SecretModule } from '../secret/secret.module';
import { SkinModule } from '../skin/skin.module';
import { TextureModule } from '../texture/texture.module';
import { KiltAuthApiService } from './kiltauthapi.service';

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
    providers: [KiltAuthApiService, JwtStrategy],
    controllers: [KiltAuthApiController],
    exports: [KiltAuthApiService]
})
export class KiltAuthModule { }
