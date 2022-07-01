import {
    Body,
    Controller,
    forwardRef,
    Get,
    HttpCode,
    Inject,
    Param,
    Put,
    Query,
    UnprocessableEntityException,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../authapi/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './dtos/profile.dto';
import { User } from '../utils/decorators';
import { UserEntity } from '../user/user/user.entity';
import { ProfileApiService } from './profileapi.service';
import { ThingsDto } from './dtos/things.dto';
import { SkinselectDto } from './dtos/skinselect.dto';
import { GameKindInProgressDto } from '../gameapi/dtos/gamekndinprogress.dto';
import { GameApiService } from '../gameapi/gameapi.service';
import { PlayerAchievementEntity } from '../playerachievement/playerachievement.entity';
import { QueryPlayerScoreDto } from '../playerscore/dtos/playerscore.dto';
import { UserService } from 'src/user/user/user.service';


@ApiTags('user')
@Controller('user')
export class ProfileApiController {

    private readonly context: string;

    constructor(
        private readonly profileService: ProfileApiService,
        private readonly userService: UserService,
        private readonly gameApiService: GameApiService,
        private readonly jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = ProfileApiController.name;
    }

    @Get('profile')
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async profile(@User() user: UserEntity): Promise<ProfileDto> {
        return this.profileService.userProfile(user)
    }

    @Get('resources')
    @HttpCode(200)
    @ApiOperation({ summary: 'User resources available to summon from the Metaverse' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async resources(@User() user: UserEntity): Promise<ThingsDto> {
        const playerItems = await this.profileService.getPlayerItems(user)
        return playerItems
    }

    @Get('verifyjwt/:jwttoken')
    @HttpCode(200)
    @ApiModelProperty()
    @ApiOperation({ summary: 'Verifies jwt token' })
    async verify(@Param('jwttoken') jwt: string) {
        try {
            return this.jwtService.verify(jwt, { ignoreExpiration: false })
        } catch (err) {
            this.logger.error(`verifyjwt:: error`, err, this.context)
            throw new UnprocessableEntityException(err?.message ?? 'JWT verification error')
        }
    }

    @Get('inprogress')
    @HttpCode(200)
    @ApiOperation({ summary: 'Returns whether there is an active game in progress or not' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getGameInProgress(dto: GameKindInProgressDto): Promise<boolean> {
        const inprogress = await this.gameApiService.getGameKindInProgress(dto)
        return inprogress
    }

    @Put('skin')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets active user skin.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async skinselect(@User() user: UserEntity, @Body() dto: SkinselectDto): Promise<boolean> {
        const success = await this.profileService.skinSelect(user, dto)
        return success
    }

    @Get('game/:gameId/player/:uuid/achievements')
    @HttpCode(200)
    @ApiOperation({ summary: 'Queries all player achievements for a game.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getPlayerAchievements(
        @Param('gameId') gameId: string,
        @Param('uuid') uuid: string
    ): Promise<PlayerAchievementEntity[]> {
        const entities = await this.gameApiService.getPlayerAchievements(gameId, uuid)
        return entities
    }

    @Get('score')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets player score for a game' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async setUserScore(
        @Query() dto: QueryPlayerScoreDto,
    ): Promise<string> {
        const score = await this.gameApiService.getPlayerScore(dto)
        return score
    }
}
