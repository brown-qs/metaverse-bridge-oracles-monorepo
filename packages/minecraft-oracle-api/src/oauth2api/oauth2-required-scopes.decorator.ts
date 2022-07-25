import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Oauth2Scope } from '../common/enums/Oauth2Scope';
import { UserEntity } from '../user/user/user.entity';
import { Oauth2ClientEntity } from './oauth2-client/oauth2-client.entity';

export const Oauth2RequiredScopes = (...scopes: Oauth2Scope[]) => SetMetadata('oauth2Scopes', scopes);

export const Oauth2User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);

/*
export const Oauth2Client = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Oauth2ClientEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.client;
    }
);*/