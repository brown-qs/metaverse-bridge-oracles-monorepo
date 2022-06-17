import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MinecraftUserEntity } from '../user/minecraft-user/minecraft-user.entity';
import { MinecraftUserService as MinecraftUserService } from '../user/minecraft-user/minecraft-user.service';

export type AuthenticatedUser = {
    player: MinecraftUserEntity
}

export enum AuthProvider {
    Email = "email",
    Kilt = "kilt",
}

export type JwtPayload = {
    sub: string;
    provider: AuthProvider,
    minecraftUuid: string | null
    minecraftUsername: string | null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly context: string;

    constructor(
        configService: ConfigService,
        private userService: MinecraftUserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.secret'),
            ignoreExpiration: false
        });
        this.context = JwtStrategy.name
    }

    async validate(payload: JwtPayload): Promise<MinecraftUserEntity> {
        this.logger.debug('validate:: called', this.context)
        //const token = req.headers.authorization.slice(7);

        if (!payload || !payload.sub || !payload.minecraftUsername) {
            this.logger.error('validate:: no uuid or username was received', null, this.context)
            throw new UnauthorizedException();
        }
        const user = await this.userService.findByUuid(payload.sub)

        if (!user) {
            throw new UnauthorizedException();
        }

        this.logger.debug('validate:: success:' + JSON.stringify(user), this.context)
        //req.user = { user, sessionKey: token } 
        return user;
    }
}
