import { Module } from '@nestjs/common';
import { Oauth2ResourceService } from './oauth2-resource.service';
import { Oauth2ResourceController } from './oauth2-resource.controller';
import { Oauth2ClientModule } from '../oauth2-client/oauth2-client.module';
import { Oauth2AuthorizationModule } from '../oauth2-authorization/oauth2-authorization.module';
import { UserService } from '../../user/user/user.service';
import { UserModule } from '../../user/user/user.module';

@Module({
  imports: [Oauth2ClientModule, Oauth2AuthorizationModule, UserModule],
  providers: [Oauth2ResourceService],
  exports: [Oauth2ResourceService],
  controllers: [Oauth2ResourceController]
})
export class Oauth2ResourceModule { }
