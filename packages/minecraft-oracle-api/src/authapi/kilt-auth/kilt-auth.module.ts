import { Module } from '@nestjs/common';
import { CacheModule } from '../../cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SecretModule } from '../../secret/secret.module';
import { SkinModule } from '../../skin/skin.module';
import { TextureModule } from '../../texture/texture.module';
import { KiltAuthService } from './kilt-auth.service';
import { KiltAuthController } from './kilt-auth.controller';
import { UserModule } from '../../user/user/user.module';
import { KiltSessionModule } from '../../user/kilt-session/kilt-session.module';
import { KiltDappModule } from '../../user/kilt-dapp/kilt-dapp.module';
import { DidModule } from '../../user/did/did.module';
import { EmailModule } from '../../user/email/email.module';

@Module({
  providers: [KiltAuthService],
  imports: [
    EmailModule,
    DidModule,
    KiltDappModule,
    UserModule,
    KiltSessionModule,
    SecretModule,
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
