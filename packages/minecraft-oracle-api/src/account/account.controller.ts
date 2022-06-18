import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { JwtAuthGuard } from 'src/authapi/jwt-auth.guard';
import { GameApiService } from 'src/gameapi/gameapi.service';
import { ProfileDto } from 'src/profileapi/dtos/profile.dto';
import { ProfileApiService } from 'src/profileapi/profileapi.service';
import { MinecraftUserEntity } from 'src/user/minecraft-user/minecraft-user.entity';
import { User } from 'src/utils/decorators';
import { AccountDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetches user account' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async account(@User() user: any): Promise<AccountDto> {
        const account = {
            provider: user.provider,
            email: user.email,
            minecraftUuid: user.minecraftUuid
        }
        return account
    }

    @Patch('link_minecraft')
    @ApiOperation({ summary: 'Binds minecraft uuid to user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async linkMinecraft(@Body() dto: any) {
        const jwt = dto.minecraftJwt
        console.log("jwt: " + jwt)
        return { success: true }
    }
}
