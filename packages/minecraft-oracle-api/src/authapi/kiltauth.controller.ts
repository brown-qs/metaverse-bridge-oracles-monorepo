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
    @ApiOperation({ summary: 'Get kilt challenge' })
    async walletSession() {
        return await this.kiltAuthApiService.getChallenge()
    }

    @Post('wallet_session')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate wallet challenge' })
    async validateWalletSession(@Body() resp: { encryptionKeyId: string, encryptedChallenge: string, nonce: string, sessionId: string }) {
        return await this.kiltAuthApiService.verifyChallenge(resp.encryptionKeyId, resp.encryptedChallenge, resp.nonce, resp.sessionId)
    }

    @Get('present_credential')
    @ApiOperation({ summary: 'Present credential' })
    async presentCredential(@Query("walletSessionId") walletSessionId: string): Promise<void> {

    }
}
