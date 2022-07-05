import { Module } from '@nestjs/common';
import { CacheModule } from '../../cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SecretModule } from 'src/secret/secret.module';
import { SkinModule } from 'src/skin/skin.module';
import { TextureModule } from 'src/texture/texture.module';
import { KiltAuthService } from './kilt-auth.service';
import { KiltAuthController } from './kilt-auth.controller';
import { UserModule } from 'src/user/user/user.module';
import { KiltSessionModule } from 'src/user/kilt-session/kilt-session.module';

@Module({
  providers: [KiltAuthService],
  imports: [
    UserModule,
    KiltSessionModule,
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
    })],
  controllers: [KiltAuthController],
  exports: [KiltAuthService]
})
export class KiltAuthModule { }
