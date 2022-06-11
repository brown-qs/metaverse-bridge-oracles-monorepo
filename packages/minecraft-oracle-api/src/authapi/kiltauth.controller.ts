import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Query,
    Redirect,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WalletLoginApiDto } from './dtos/kilt.dto';
import { KiltAuthApiService } from './kiltauthapi.service';

@ApiTags('kiltauth')
@Controller('kiltauth')
export class KiltAuthApiController {

    private readonly context: string;
    constructor(
        private readonly kiltAuthApiService: KiltAuthApiService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = KiltAuthApiController.name;
    }

    @Get('wallet_session')
    @ApiOperation({ summary: 'Get kilt wallet session challenge' })
    async walletSession() {
        return await this.kiltAuthApiService.getWalletSessionChallenge()
    }

    @Post('wallet_session')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate kilt wallet session' })
    async validateWalletSession(@Body() resp: { encryptionKeyId: string, encryptedWalletSessionChallenge: string, nonce: string, sessionId: string }) {
        return await this.kiltAuthApiService.verifyWalletSessionChallenge(resp.encryptionKeyId, resp.encryptedWalletSessionChallenge, resp.nonce, resp.sessionId)
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
    async validateWalletCredential(@Body() dto: WalletLoginApiDto): Promise<void> {
        return await this.kiltAuthApiService.verifyWalletLoginChallenge(dto.sessionId, dto.message)
    }
}
