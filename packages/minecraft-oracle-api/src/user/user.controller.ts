import {
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Request,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './dtos/profile.dto';
import { User } from 'src/utils/decorators';
import { UserEntity } from './user.entity';


@ApiTags('user')
@Controller('user')
export class UserController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly jwtServie: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = UserController.name;
    }

    @Get('profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async profile(@User() user: UserEntity): Promise<ProfileDto> {
        return {
            uuid: user.uuid,
            hasGame: user.hasGame,
            userName: user.userName,
            role: user.role,
            allowedToPlay: user.allowedToPlay,
            serverId: user.serverId
        }
    }

    
    @Get('verifyjwt/:jwttoken')
    @HttpCode(200)
    @ApiModelProperty()
    @ApiOperation({ summary: 'Verifies jwt token' })
    async verify(@Param('jwttoken') jwt: string) {
        try {
            return this.jwtServie.verify(jwt, {ignoreExpiration: false})
        } catch (err) {
            this.logger.error(`verifyjwt:: error`, err, this.context)
            throw new UnprocessableEntityException(err?.message ?? 'JWT verification error')
        }
    }
}
