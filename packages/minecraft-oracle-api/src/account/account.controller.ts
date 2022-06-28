import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Email } from 'aws-sdk/clients/codecommit';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { JwtAuthGuard } from 'src/authapi/jwt-auth.guard';
import { GameApiService } from 'src/gameapi/gameapi.service';
import { ProfileDto } from 'src/profileapi/dtos/profile.dto';
import { ProfileApiService } from 'src/profileapi/profileapi.service';
import { EmailUserEntity } from 'src/user/email-user/email-user.entity';
import { UserEntity } from 'src/user/user/user.entity';
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
    async account(@User() user: EmailUserEntity): Promise<AccountDto> {
        const account = {
            id: user.id,
            email: user.email,
            minecraftUuid: user.minecraftUuid
        }
        return account
    }
}
