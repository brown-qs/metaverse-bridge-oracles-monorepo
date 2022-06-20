import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { KiltAuthService } from './kilt-auth.service';
import { WalletSessionDto, WalletLoginDto } from './dtos';
import { EmailUserJwtPayload } from '../jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/kilt')
export class KiltAuthController {
    private readonly context: string;
    constructor(
        private readonly kiltAuthApiService: KiltAuthService,
        private jwtService: JwtService,
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

        const payload: EmailUserJwtPayload = { sub: user.id, minecraftUuid: null };
        const jwtToken = this.jwtService.sign(payload);
        return { success: true, jwt: jwtToken }
    }
}
