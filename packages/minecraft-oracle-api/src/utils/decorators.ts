import { createParamDecorator, ExecutionContext, } from '@nestjs/common';
import { EmailUserEntity } from 'src/user/email-user/email-user.entity';
import { UserEntity } from '../user/user/user.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): EmailUserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
