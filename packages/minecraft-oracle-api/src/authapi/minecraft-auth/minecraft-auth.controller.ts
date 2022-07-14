import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Query,
    Redirect,
    UnauthorizedException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from 'src/utils/decorators';
import { error, query } from 'winston';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { MinecraftAuthService } from './minecraft-auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user/user.service';
import { MinecraftLinkService } from 'src/user/minecraft-link/minecraft-link.service';
import { SharedSecretGuard } from '../secret.guard';
import { UserEntity } from 'src/user/user/user.entity';
import { GameService } from 'src/game/game.service';
import { GameKind } from 'src/game/game.enum';
@ApiTags('auth')
@Controller('auth/minecraft')
export class MinecraftAuthController {

    private readonly context: string;

    constructor(
        private readonly authApiService: MinecraftAuthService,
        private readonly userService: UserService,
        private readonly minecraftLinkService: MinecraftLinkService,
        private readonly gameService: GameService,
        private configService: ConfigService,

        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MinecraftAuthController.name;
    }

    @Get('login')
    @ApiOperation({ summary: 'Sends redirect url to Minecraft authentication' })
    async login(@User() user: UserEntity) {
        const { redirectUrl } = await this.authApiService.getMicrosoftAuthUrl();

        if (!redirectUrl) {
            throw new UnprocessableEntityException("Unable to get Minecraft login url. Please try again.");
        }

        return { status: "success", redirectUrl }
    }

    @Get('response')
    @HttpCode(308)
    @ApiOperation({ summary: 'Proxy Minecraft auth request to frontend' })
    @Redirect()
    async redirect(@Query() query: { code: string, error?: string, error_description?: string }) {
        if (!!query.error) {
            this.logger.error(`Response query:: ${query?.error}: ${query?.error_description}`, null, this.context)
        }
        const redirectUrl = `${this.configService.get<number>('frontend.url')}/account/minecraft/verify?${new URLSearchParams(query).toString()}`
        console.log("redirectUrl: " + redirectUrl)
        return { statusCode: HttpStatus.TEMPORARY_REDIRECT, url: redirectUrl }
    }

    @Get('link')
    @ApiOperation({ summary: 'Link a Minecraft.' })
    @UseGuards(JwtAuthGuard)
    async link(@User() user: UserEntity, @Query() query: { code: string, error?: string, error_description?: string }) {
        if (!!query.error) {
            this.logger.error(`Link query:: ${query?.error}: ${query?.error_description}`, null, this.context)
        }

        this.logger.debug(`Link query: ${query?.code}`, this.context)
        const result = await this.authApiService.authLogin(query.code);

        try {
            await this.userService.linkMinecraftByUserUuid(user.uuid, result.minecraftUuid, result.minecraftUserName, result.ownership)
        } catch (err) {
            this.logger.error(`authLogin: error merging minecraft user into database: mc uuid: ${result.minecraftUuid}`, err, this.context)

            if (err instanceof UnprocessableEntityException) {
                throw err
            } else {
                throw new UnprocessableEntityException(`Error linking minecraft account`)
            }

        }
        this.logger.debug(`Link result: ${JSON.stringify(result)}`, this.context)

        return { success: true }
    }

    @Delete('unlink')
    @ApiOperation({ summary: 'Unlink minecraft' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async unlink(@User() user: UserEntity) {
        const minecraftUuid = user.minecraftUuid
        if (!minecraftUuid) {
            throw new UnprocessableEntityException('There is no Minecraft account to unlink')
        }
        if (!!(await this.gameService.findOne({ ongoing: true, type: GameKind.CARNAGE }))) {
            throw new UnprocessableEntityException('You cannot not unlink a Minecraft account during Carnage or the resource distribution period after Carnage.')
        }
        try {
            await this.userService.unlinkMinecraftByUserUuid(user.uuid)

        } catch (err) {
            console.log(err)
            this.logger.error(`Unlink from db failed`, err, this.context)

            throw new UnprocessableEntityException('Unlink failed')
        }

        //log unlink
        await this.minecraftLinkService.unlink(user, user, minecraftUuid)
        return { success: true }
    }

    /*
    //too dangerous to be used in production, could be used for stealing
    //privileged users only!
    @Get('test_migration')
    @ApiBearerAuth('AuthenticationHeader')
    @UseGuards(SharedSecretGuard)
    @ApiOperation({ summary: 'Migrate an old minecraft user to a user with an email' })
    async testMigration(@Query() query: { uuid: string, minecraftUuid: string }) {
        await this.userService.testMigration(query.uuid, query.minecraftUuid)
    }
    */

}
