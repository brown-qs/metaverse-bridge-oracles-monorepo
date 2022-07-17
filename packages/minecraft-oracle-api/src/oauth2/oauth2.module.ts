import { Module } from '@nestjs/common';
import { Oauth2AuthorizationModule } from './oauth2-authorization/oauth2-authorization.module';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { Oauth2ResourceModule } from './oauth2-resource/oauth2-resource.module';
import OAuth2Server from 'oauth2-server'
import { OAUTH2_SERVER } from './constants';
import { Oauth2Service } from './oauth2.service';
@Module({
    imports: [Oauth2ClientModule],
    providers: [{
        provide: OAUTH2_SERVER,
        useFactory: (model: Oauth2Service): OAuth2Server => {

            return new OAuth2Server({ model })
        },
        inject: [Oauth2Service],
    }, Oauth2Service],
    exports: [OAUTH2_SERVER],
    controllers: []
})
export class Oauth2Module { }
