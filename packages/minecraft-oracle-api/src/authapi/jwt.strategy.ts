import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../user/user/user.entity';
import { UserService as UserService } from '../user/user/user.service';

export type AuthenticatedUser = {
    player: UserEntity
}



export type UserJwtPayload = {
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly context: string;

    constructor(
        configService: ConfigService,
        private userService: UserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        //extra jwt from query string for microsoft callback
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter("jwt")]),
            secretOrKey: configService.get<string>('jwt.secret'),
            ignoreExpiration: false
        });

        this.context = JwtStrategy.name
    }

    async validate(payload: UserJwtPayload): Promise<any> {
        this.logger.debug('validate:: called', this.context)
        //const token = req.headers.authorization.slice(7);
        if (!payload || !payload.sub) {
            this.logger.error('validate:: sub (uuid) required', null, this.context)
            throw new UnauthorizedException();
        }

        let user = await this.userService.findByUuid(payload.sub)
        user = { ...user }

        if (!user) {
            throw new UnauthorizedException();
        }

        this.logger.debug('validate:: success:' + JSON.stringify(user), this.context)
        //req.user = { user, sessionKey: token } 
        return user;
    }
}
