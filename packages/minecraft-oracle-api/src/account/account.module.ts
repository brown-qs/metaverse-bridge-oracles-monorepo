import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [JwtModule.registerAsync({
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
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule { }
