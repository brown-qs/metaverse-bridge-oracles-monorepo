import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Observable } from 'rxjs';
import { Oauth2Scope } from '../common/enums/Oauth2Scope';
import { Oauth2AuthorizationService } from './oauth2-authorization/oauth2-authorization.service';
import { Oauth2ClientService } from './oauth2-client/oauth2-client.service';

@Injectable()
export class Oauth2Guard implements CanActivate {
    private context: string

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        private readonly oauth2ClientService: Oauth2ClientService,
        private readonly oauth2AuthorizationService: Oauth2AuthorizationService,
        private reflector: Reflector
    ) {
        this.context = Oauth2Guard.name
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<true> {
        const request = context.switchToHttp().getRequest();
        const requiredScopes = this.reflector.get<Oauth2Scope[]>('oauth2Scopes', context.getHandler());

        const authorizationHeader: string = request.headers['Authorization'] ?? request.headers['authorization']

        if (!authorizationHeader) {
            throw new UnauthorizedException("OAuth 2.0 Authorization header missing")
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("OAuth 2.0 Authorization header must begin with Bearer <access token>")
        }

        const accessToken = authorizationHeader.slice(7)

        if (/[^0-9a-zA-Z]/.test(accessToken)) {
            throw new UnauthorizedException("OAuth 2.0 Access Token must be alphanumeric")
        }

        const result = await this.oauth2AuthorizationService.findOne({ accessToken: accessToken }, { relations: ["user", "client"] })
        if (!result) {
            throw new UnauthorizedException("OAuth 2.0 Access Token invalid")
        }

        if (result.valid === false) {
            throw new UnauthorizedException("OAuth 2.0 Access Token revoked")
        }

        if (result.client.approved !== true) {
            throw new UnauthorizedException("client has not passed approval")

        }

        const accessTokenCreateTime = result.accessTokenCreatedAt.getTime()
        const timeDiff = new Date().getTime() - accessTokenCreateTime

        if (timeDiff > (result.client.accessTokenValidity * 1000)) {
            throw new UnauthorizedException("OAuth 2.0 Access Token expired")
        }

        const clientScopes: Oauth2Scope[] = result.client.scopes
        const sessionScopes: Oauth2Scope[] = result.scopes
        console.log(`session scopes: ${sessionScopes}`)
        const invalidClientScopes: Oauth2Scope[] = []
        const invalidSessionScopes: Oauth2Scope[] = []
        for (const scope of requiredScopes) {
            if (!clientScopes.includes(scope)) {
                invalidClientScopes.push(scope)
            }

            if (!sessionScopes.includes(scope)) {
                invalidSessionScopes.push(scope)
            }
        }

        if (invalidSessionScopes.length > 0 || invalidClientScopes.length > 0) {
            let msg = []
            if (invalidSessionScopes.length > 0) {
                msg.push(`User didn't authorize required scopes: ${invalidSessionScopes.join(", ")}`)
            }
            if (invalidClientScopes.length > 0) {
                msg.push(`OAuth client isn't allowed required scopes: ${invalidClientScopes.join(", ")}`)
            }
            throw new UnauthorizedException(msg.join(", "))
        }

        request.user = result.user
        request.oauthClient = result.client
        return true
    }
}
