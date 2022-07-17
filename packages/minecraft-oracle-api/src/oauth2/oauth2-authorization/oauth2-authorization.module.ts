import { Module } from '@nestjs/common';
import { Oauth2AuthorizationService } from './oauth2-authorization.service';

@Module({
  providers: [Oauth2AuthorizationService]
})
export class Oauth2AuthorizationModule {}
