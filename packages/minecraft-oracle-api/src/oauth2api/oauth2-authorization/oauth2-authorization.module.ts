import { forwardRef, Module } from '@nestjs/common';
import { Oauth2AuthorizationService } from './oauth2-authorization.service';
import { Oauth2AuthorizationController } from './oauth2-authorization.controller';
import { Oauth2Module } from '../oauth2.module';
import { Oauth2ClientModule } from '../oauth2-client/oauth2-client.module';
import { Oauth2AuthorizationEntity } from './oauth2-authorization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => TypeOrmModule.forFeature([Oauth2AuthorizationEntity]))
    , Oauth2ClientModule],
  providers: [Oauth2AuthorizationService],
  controllers: [Oauth2AuthorizationController],
  exports: [Oauth2AuthorizationService]
})
export class Oauth2AuthorizationModule { }
