import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import { Body, Controller, ForbiddenException, Get, HttpCode, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { KiltAuthService } from './kilt-auth.service';
import { WalletSessionDto, WalletLoginDto } from './dtos';
import { UserJwtPayload } from '../jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserEntity } from 'src/user/user/user.entity';
import { User } from 'src/utils/decorators';
import { UserRole } from 'src/common/enums/UserRole';

@Controller('auth/kilt')
export class KiltAuthController {
    private readonly context: string;
    constructor(
        private readonly kiltAuthApiService: KiltAuthService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthController.name;
    }

    @Get('wallet_session')
    @ApiOperation({ summary: 'Get kilt wallet session challenge' })
    async walletSession() {
        return await this.kiltAuthApiService.getWalletSessionChallenge()
    }

    @Post('wallet_session')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate kilt wallet session' })
    async validateWalletSession(@Body() dto: WalletSessionDto) {
        return await this.kiltAuthApiService.verifyWalletSessionChallenge(dto.encryptionKeyId, dto.encryptedWalletSessionChallenge, dto.nonce, dto.sessionId)
    }

    //creates and returns an encrypted message for Sporran session to prompt credential sharing
    @Get('wallet_login')
    @ApiOperation({ summary: 'Get kilt wallet login challenge' })
    async getWalletCredential(@Query("sessionId") sessionId: string): Promise<IEncryptedMessage> {
        return await this.kiltAuthApiService.getWalletLoginChallenge(sessionId)
    }

    @Post('wallet_login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate kilt wallet login challenge' })
    async validateWalletCredential(@Body() dto: WalletLoginDto) {
        const user = await this.kiltAuthApiService.verifyWalletLoginChallenge(dto.sessionId, dto.message)
        const payload: UserJwtPayload = { sub: user.uuid };
        const jwtToken = this.jwtService.sign(payload);
        return { success: true, jwt: jwtToken }
    }

    @Get('did_configuration')
    @HttpCode(200)
    @ApiOperation({ summary: 'Dynamically generated did-configuration.json' })
    async didConfiguration() {
        let result
        try {
            result = await this.kiltAuthApiService.didConfiguration()
        } catch (e) {
            console.log(e.stack)
            throw e
        }

        return result
    }

    @Get('add_attestation_key')
    @HttpCode(200)
    @ApiOperation({ summary: 'Add attestation key' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async addAttestationKey(@User() user: UserEntity) {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Not admin')
        }
        let result
        try {
            result = await this.kiltAuthApiService.addAttestationKey()
        } catch (e) {
            console.log(e.stack)
            throw e
        }

        return result
    }
}
