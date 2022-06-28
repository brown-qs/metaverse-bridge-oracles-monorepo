import { createParamDecorator, ExecutionContext, } from '@nestjs/common';
import { UserEntity } from '../user/user/user.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
