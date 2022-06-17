import { createParamDecorator, ExecutionContext, } from '@nestjs/common';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): MinecraftUserEntity => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
