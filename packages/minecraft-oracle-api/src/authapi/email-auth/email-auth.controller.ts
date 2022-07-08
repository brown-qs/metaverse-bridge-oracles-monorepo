import { Body, Controller, Get, Inject, Post, Put, Query, Redirect, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { UserEntity } from 'src/user/user/user.entity';
import { User } from 'src/utils/decorators';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserJwtPayload } from '../jwt.strategy';
import { LoginDto, VerifyDto } from './dtos';
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
    @ApiOperation({ summary: 'Post email and sends login code' })
    async login(@Body() dto: LoginDto): Promise<{ success: boolean }> {
        await this.emailAuthService.sendAuthEmail(dto.email, dto["g-recaptcha-response"])
        return { success: true }
    }

    @Put('change')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Change email address and send login code to new email' })
    async change(@User() user: UserEntity, @Body() dto: LoginDto): Promise<{ success: boolean }> {
        await this.emailAuthService.sendAuthChangeEmail(user.uuid, dto.email, dto["g-recaptcha-response"])
        return { success: true }
    }

    @Get('verify')
    @ApiOperation({ summary: 'Verify login code' })
    async verify(@Query("loginKey") loginKey: string): Promise<VerifyDto> {
        const user = await this.emailAuthService.verifyLoginKey(loginKey)
        const payload: UserJwtPayload = { sub: user.uuid };
        const jwtToken = this.jwtService.sign(payload);
        return { success: true, jwt: jwtToken }
    }
}
