import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailAuthController } from './email-auth.controller';
import { EmailAuthService } from './email-auth.service';
import { EmailLoginKeyModule } from '../../user/email-login-key/email-login-key.module';
import { UserModule } from '../../user/user/user.module';
import { EmailChangeModule } from '../../user/email-change/email-change.module';
import { EmailModule } from '../../user/email/email.module';

@Module({
  imports: [UserModule, EmailLoginKeyModule, EmailChangeModule, EmailModule,
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
