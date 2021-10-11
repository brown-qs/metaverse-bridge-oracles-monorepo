import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    Redirect,
    Req,
    Request,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthService } from './auth.service';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    private readonly context: string;

    constructor(
        private readonly authService: AuthService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { 
        this.context = AuthController.name;
    }

    @Get('login')
    @HttpCode(307)
    @ApiOperation({ summary: 'Redirects user to Minecraft authentication' })
    @Redirect()
    async login() {
        const { redirectUrl } = await this.authService.getMicrosoftAuthUrl();
        
        if (!redirectUrl) {
            throw new UnauthorizedException();
        }

        return {statusCode: HttpStatus.TEMPORARY_REDIRECT,  url: redirectUrl}
    }

    @Get('response')
    @HttpCode(308)
    @ApiOperation({ summary: 'Minecraft authentication successful redirect target. Redirects again to the final destination with a jwt token.' })
    @Redirect()
    async redirect(@Query() query: {code: string}) {
        this.logger.debug(`Response query: ${query?.code}`, this.context)
        const result = await this.authService.authLogin(query.code);
        this.logger.debug(`Response result: ${JSON.stringify(result)}`, this.context)
        return {statusCode: HttpStatus.PERMANENT_REDIRECT,  url: result.redirectUrl}
    }
}
