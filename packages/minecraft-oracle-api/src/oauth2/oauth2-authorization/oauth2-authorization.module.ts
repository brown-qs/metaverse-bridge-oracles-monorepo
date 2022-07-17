import { Module } from '@nestjs/common';
import { Oauth2AuthorizationService } from './oauth2-authorization.service';
import { Oauth2AuthorizationController } from './oauth2-authorization.controller';
import { Oauth2Module } from '../oauth2.module';

@Module({
  imports: [Oauth2Module],
  providers: [Oauth2AuthorizationService],
  controllers: [Oauth2AuthorizationController]
})
export class Oauth2AuthorizationModule { }
