import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AuthorizationCode, AuthorizationCodeModel, Callback, Client, Falsey, RequestAuthenticationModel, Token, User } from 'oauth2-server';
import { Oauth2ClientService } from './oauth2-client/oauth2-client.service';

@Injectable()
export class Oauth2Service implements AuthorizationCodeModel {
    context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        private oauth2ClientService: Oauth2ClientService,
    ) {
        this.context = Oauth2Service.name
    }

    async generateRefreshToken?(client: Client, user: User, scope: string | string[]): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async generateAuthorizationCode?(client: Client, user: User, scope: string | string[]): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async getAuthorizationCode(authorizationCode: string): Promise<Falsey | AuthorizationCode> {
        throw new Error('Method not implemented.');
    }

    async saveAuthorizationCode(code: Pick<AuthorizationCode, 'redirectUri' | 'authorizationCode' | 'expiresAt' | 'scope'>, client: Client, user: User): Promise<Falsey | AuthorizationCode> {
        throw new Error('Method not implemented.');
    }

    async revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async validateScope?(user: User, client: Client, scope: string | string[]): Promise<string | false | 0 | string[]> {
        throw new Error('Method not implemented.');
    }

    async generateAccessToken?(client: Client, user: User, scope: string | string[]): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async getClient(clientId: string, clientSecret: string): Promise<Falsey | Client> {
        const client = await this.oauth2ClientService.findOne({ clientId, clientSecret })
        if (client) {
            const c = {
                id: client.clientId,
                redirectUris: [client.redirectUri],
                grants: ["authorization_code"],
                accessTokenLifetime: client.accessTokenValidity,
                refreshTokenLifetime: client.refreshTokenValidity
            }
            return c
        } else {
            return false;
        }
    }

    async saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
        throw new Error('Method not implemented.');
    }

    async getAccessToken(accessToken: string): Promise<Token | Falsey> {
        throw new Error('Method not implemented.');
    }

    async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
