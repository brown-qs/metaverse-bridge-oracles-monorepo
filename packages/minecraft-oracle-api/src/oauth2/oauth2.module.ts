import { Module } from '@nestjs/common';
import { Oauth2AuthorizationModule } from './oauth2-authorization/oauth2-authorization.module';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { Oauth2ResourceModule } from './oauth2-resource/oauth2-resource.module';
import Oauth2Server from 'oauth2-server'
@Module({
    imports: [Oauth2AuthorizationModule, Oauth2ClientModule, Oauth2ResourceModule],
    providers: [{
        provide: OAUTH2_SERVER,
        useFactory: (): OAuth2Server =>
            new OAuth2Server(
                Object.assign({}, options, { model }),
            ),
        inject: [],
    }],
    exports: [],
    controllers: []
})
export class Oauth2Module { }
