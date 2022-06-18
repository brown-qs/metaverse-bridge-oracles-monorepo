import { Body, Controller, Get, Inject, Post, Query, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AuthProvider, JwtPayload } from '../jwt.strategy';
import { LoginDto } from './dtos';
import { EmailAuthService } from './email-auth.service';

@Controller('auth/email')
export class EmailAuthController {
    private readonly context: string;
    constructor(private readonly emailAuthService: EmailAuthService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        private jwtService: JwtService,
        private configService: ConfigService,

    ) {
        this.context = EmailAuthController.name;

    }
    @Post('login')
    @ApiOperation({ summary: 'Post email and sends login link' })
    async login(@Body() dto: LoginDto): Promise<{ success: boolean }> {
        await this.emailAuthService.sendAuthEmail(dto.email, dto["g-recaptcha-response"])
        return { success: true }
    }

    @Get('verify')
    @ApiOperation({ summary: 'Verify login link' })
    async verify(@Query("loginKey") loginKey: string) {
        const user = await this.emailAuthService.verifyAuthLink(loginKey)
        const payload: JwtPayload = { sub: user.id, provider: AuthProvider.Email, minecraftUuid: null };
        const jwtToken = this.jwtService.sign(payload);

        return { success: true, jwt: jwtToken }
    }
}
