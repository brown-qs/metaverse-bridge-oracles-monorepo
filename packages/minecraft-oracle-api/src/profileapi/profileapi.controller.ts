import {
    BadRequestException,
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
import { AssetDto, TextureDto, ThingsDto } from './dtos/things.dto';
import { SkinselectDto } from './dtos/skinselect.dto';
import { GameKindInProgressDto } from '../gameapi/dtos/gamekndinprogress.dto';
import { GameApiService } from '../gameapi/gameapi.service';
import { PlayerAchievementEntity } from '../playerachievement/playerachievement.entity';
import { QueryPlayerScoreDto } from '../playerscore/dtos/playerscore.dto';
import { UserService } from '../user/user/user.service';
import { GamerTagDto } from './dtos/gamertag.dto';
import xss from "xss"
import { CollectionFragmentService } from '../collectionfragment/collectionfragment.service';
import { CollectionFragmentEntity } from '../collectionfragment/collectionfragment.entity';
import { Not, IsNull } from 'typeorm';

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

    @Get('in-game-items')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get user assets' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async inGameItems(@User() user: UserEntity): Promise<AssetDto[]> {
        const inGameItems = await this.profileService.getInGameItems(user)
        return inGameItems
    }

    @Get('skins')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get user skins' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getSkins(@User() user: UserEntity): Promise<TextureDto[]> {
        const skins = await this.profileService.getSkins(user)
        return skins
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

    @Put('gamertag')
    @HttpCode(200)
    @ApiOperation({ summary: 'Sets gamer tag.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async setGamerTag(@User() user: UserEntity, @Body() dto: GamerTagDto) {
        if (typeof dto.gamerTag !== "string") {
            throw new BadRequestException("Gamer Tag must be a string")
        }
        this.logger.debug(`gamertag:: user ${user.uuid} wants to set gamerTag encodeURIComponent() ${encodeURIComponent(dto.gamerTag)}`, this.context)

        let gamerTag = dto.gamerTag
            .trim()
            .replace(/[\u0000-\u001F\u007F-\u009F\u200B\u200E]/g, "") //remove unicode control characters
            .normalize("NFKC") //normalize string
            .replace(/(<([^>]+)>)/ig, "") //prevent xss attacks
            .replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "") //remove emojis cuz they cannot be displayed in all browsers

        //another xss filter that is standards compliant against a known list of attack vectors    
        gamerTag = xss(gamerTag, {
            whiteList: {}, // empty, means filter out all tags
            stripIgnoreTag: true, // filter out all HTML not in the whitelist
            stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
            // to filter out its content
        })

        if (gamerTag.length === 0) {
            throw new BadRequestException("Gamer Tag is either blank or contains invalid characters")
        }

        if (gamerTag.length > 30) {
            throw new BadRequestException("Gamer Tag is too long")
        }

        try {
            await this.profileService.setGamerTag(user, gamerTag)

        } catch (e) {
            if (String(e).includes("duplicate key")) {
                throw new BadRequestException("Gamer Tag is already taken")
            } else {
                throw e
            }
        }
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
