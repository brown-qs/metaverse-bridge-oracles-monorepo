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

@ApiTags('auth')
@Controller('auth/minecraft')
export class MinecraftAuthController {

    private readonly context: string;

    constructor(
        private readonly authApiService: MinecraftAuthService,
        private readonly userService: UserService,
        private readonly minecraftLinkServer: MinecraftLinkService,
        private jwtService: JwtService,
        private configService: ConfigService,

        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MinecraftAuthController.name;
    }

    @Get('login')
    @HttpCode(307)
    @ApiOperation({ summary: 'Redirects user to Minecraft authentication' })
    @Redirect()
    async login(@Query() query: { jwt: string }) {
        const { redirectUrl } = await this.authApiService.getMicrosoftAuthUrl(query.jwt);

        if (!redirectUrl) {
            throw new UnauthorizedException();
        }

        return { statusCode: HttpStatus.TEMPORARY_REDIRECT, url: redirectUrl }
    }

    @Get('response')
    @HttpCode(308)
    @ApiOperation({ summary: 'Minecraft authentication successful redirect target. Redirects again to the final destination with a jwt token.' })
    //based on qs
    @UseGuards(JwtAuthGuard)
    @Redirect()
    async redirect(@User() user: UserEntity, @Query() query: { code: string, jwt: string, error?: string, error_description?: string }) {
        if (!!query.error) {
            this.logger.error(`Response query:: ${query?.error}: ${query?.error_description}`, null, this.context)
        }
        this.logger.debug(`Response query: ${query?.code}`, this.context)
        const result = await this.authApiService.authLogin(query.code, user, query.jwt);
        this.logger.debug(`Response result: ${JSON.stringify(result)}`, this.context)

        const payload: UserJwtPayload = { sub: user.uuid };
        const jwtToken = this.jwtService.sign(payload);

        const redirectUrl = `${this.configService.get<number>('frontend.url')}/auth/${jwtToken}`
        return { statusCode: HttpStatus.TEMPORARY_REDIRECT, url: redirectUrl }
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
        try {
            await this.userService.unlinkMinecraftByUserUuid(user.uuid)

        } catch (err) {
            console.log(err)
            this.logger.error(`Unlink from db failed`, err, this.context)

            throw new UnprocessableEntityException('Unlink failed')
        }

        //log unlink
        await this.minecraftLinkServer.unlink(user, user, minecraftUuid)

        const payload: UserJwtPayload = { sub: user.uuid };
        const jwtToken = this.jwtService.sign(payload);

        const redirectUrl = `${this.configService.get<number>('frontend.url')}/auth/${jwtToken}`
        return { jwt: jwtToken }

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
