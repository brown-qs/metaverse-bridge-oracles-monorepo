import { createParamDecorator, ExecutionContext, } from '@nestjs/common';
import { EmailUserEntity } from 'src/user/email-user/email-user.entity';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): EmailUserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
