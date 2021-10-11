import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Put,
    Request,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthenticatedUser } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enums/UserRole';
import { boolean } from 'fp-ts';
import { User } from 'src/utils/decorators';
import { GameService, PlayerTextureMapDto } from './game.service';
import { UserService } from 'src/user/user.service';

class UserDto {
    
    @ApiProperty({ description: 'User UUID'})
    uuid: string
}

class ProfileDto {
    
    @ApiProperty({ description: 'User UUID'})
    uuid: string

    @ApiProperty({ description: 'User name'})
    userName: string

    @ApiProperty({ description: 'User role'})
    role: UserRole

    @ApiProperty({ description: 'Bought the game or not'})
    hasGame: boolean

    @ApiProperty({ description: 'Is the user allowed to play'})
    allowedToPlay: boolean
}

@ApiTags('game')
@Controller('game')
export class GameController {

    private readonly context: string;

    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = GameController.name;
    }

    @Get('player/:uuid/profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    async profile(@Param('uuid') uuid: string): Promise<ProfileDto> {
        const user = await this.userService.findByUuid(uuid)
        return {
            uuid: user.uuid,
            userName: user.userName,
            allowedToPlay: user.allowedToPlay,
            hasGame: user.hasGame,
            role: user.role
        }
    }

    @Get('player/:uuid/textures')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches player textures' })
    async skin(@Param('uuid') uuid: string): Promise<PlayerTextureMapDto> {
        const user = await this.userService.findByUuid(uuid)
        if (!user) {
            throw new UnprocessableEntityException('Player was not found')
        }
        return this.gameService.getTexture(user)
    }

    @Get('player/:uuid/allowed')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    async allowed(@Param('uuid') uuid: string): Promise<boolean> {
        const user = await this.userService.findByUuid(uuid)
        return user?.allowedToPlay ?? false
    }
}
