import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Query,
    Redirect,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MinecraftAuthService } from './minecraft-auth.service';

@ApiTags('auth')
@Controller('auth/microsoft')
export class MicrosoftAuthController {

    private readonly context: string;

    constructor(
        private readonly authApiService: MinecraftAuthService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = MicrosoftAuthController.name;
    }

    @Get('login')
    @HttpCode(307)
    @ApiOperation({ summary: 'Redirects user to Minecraft authentication' })
    @Redirect()
    async login() {
        const { redirectUrl } = await this.authApiService.getMicrosoftAuthUrl();

        if (!redirectUrl) {
            throw new UnauthorizedException();
        }

        return { statusCode: HttpStatus.TEMPORARY_REDIRECT, url: redirectUrl }
    }

    @Get('response')
    @HttpCode(308)
    @ApiOperation({ summary: 'Minecraft authentication successful redirect target. Redirects again to the final destination with a jwt token.' })
    @Redirect()
    async redirect(@Query() query: { code: string, error?: string, error_description?: string }) {
        if (!!query.error) {
            this.logger.error(`Response query:: ${query?.error}: ${query?.error_description}`, null, this.context)
        }
        this.logger.debug(`Response query: ${query?.code}`, this.context)
        const result = await this.authApiService.authLogin(query.code);
        this.logger.debug(`Response result: ${JSON.stringify(result)}`, this.context)
        return { statusCode: HttpStatus.PERMANENT_REDIRECT, url: result.redirectUrl }
    }
}
