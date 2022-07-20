import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2ClientEntity } from './oauth2-client.entity';
import { Oauth2ClientService } from './oauth2-client.service';
import { Oauth2ClientController } from './oauth2-client.controller';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([Oauth2ClientEntity]))
  ],
  providers: [Oauth2ClientService],
  exports: [Oauth2ClientService],
  controllers: [Oauth2ClientController]
})
export class Oauth2ClientModule { }
