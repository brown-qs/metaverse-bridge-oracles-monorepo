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
import { KiltSessionModule } from 'src/kilt-session/kilt-session.module';
import { KiltDidEmailModule } from 'src/user/kilt-did-email/kilt-did-email.module';
import { UserModule } from 'src/user/user/user.module';

@Module({
  providers: [KiltAuthService],
  imports: [
    UserModule,
    KiltDidEmailModule,
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
