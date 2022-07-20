import { Module } from '@nestjs/common';
import { Oauth2AuthorizationModule } from './oauth2-authorization/oauth2-authorization.module';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { Oauth2ResourceModule } from './oauth2-resource/oauth2-resource.module';
import OAuth2Server from 'oauth2-server'
import { Oauth2Guard } from './oauth2.guard';
@Module({
    imports: [Oauth2ClientModule, Oauth2AuthorizationModule, Oauth2ResourceModule],
    providers: [Oauth2Guard],
    exports: [],
    controllers: []
})
export class Oauth2Module { }
