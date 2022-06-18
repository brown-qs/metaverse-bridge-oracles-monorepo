import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailUserEntity } from 'src/user/email-user/email-user.entity';
import { EmailUserModule } from 'src/user/email-user/email-user.module';
import { EmailAuthController } from './email-auth.controller';
import { EmailAuthService } from './email-auth.service';

@Module({
  imports: [EmailUserModule,
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
  providers: [EmailAuthService],
  controllers: [EmailAuthController],
  exports: [EmailAuthService]
})
export class EmailAuthModule { }
