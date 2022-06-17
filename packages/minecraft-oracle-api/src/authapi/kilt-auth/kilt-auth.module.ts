import { Module } from '@nestjs/common';
import { CacheModule } from '../../cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SecretModule } from 'src/secret/secret.module';
import { SkinModule } from 'src/skin/skin.module';
import { TextureModule } from 'src/texture/texture.module';
import { KiltUserModule } from 'src/user/kilt-user/kilt-user.module';
import { KiltAuthService } from './kilt-auth.service';
import { KiltAuthController } from './kilt-auth.controller';

@Module({
  providers: [KiltAuthService],
  imports: [
    KiltUserModule,
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
