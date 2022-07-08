import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { KiltAuthService } from './kilt-auth.service';
import { WalletSessionDto, WalletLoginDto } from './dtos';
import { UserJwtPayload } from '../jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
        const payload: UserJwtPayload = { sub: user.uuid, minecraftUuid: user.minecraftUuid };
        const jwtToken = this.jwtService.sign(payload);
        return { success: true, jwt: jwtToken }
    }

    @Get('did_configuration')
    @HttpCode(200)
    @ApiOperation({ summary: 'Dynamically generated did-configuration.json' })
    async didConfiguration() {
        console.log(`GET did_configuration\nprocess.env.KILT_WSS_ADDRESS: |${process.env.KILT_WSS_ADDRESS}|\nprocess.env.KILT_VERIFIER_MNEMONIC: |${process.env.KILT_VERIFIER_MNEMONIC}|\nprocess.env.KILT_VERIFIER_DID_URI: |${process.env.KILT_VERIFIER_DID_URI}|\nprocess.env.KILT_DAPP_NAME: |${process.env.KILT_DAPP_NAME}|\nprocess.env.KILT_CTYPE_NAME: |${process.env.KILT_CTYPE_NAME}|\nprocess.env.KILT_CTYPE_HASH: |${process.env.KILT_CTYPE_HASH}|\n\nthis.configService.get<string>('kilt.wssAddress'): |${this.configService.get<string>('kilt.wssAddress')}|\nthis.configService.get<string>('kilt.verifierMnemonic'): |${this.configService.get<string>('kilt.verifierMnemonic')}|\nthis.configService.get<string>('kilt.verifierDidUri'): |${this.configService.get<string>('kilt.verifierDidUri')}|\nthis.configService.get<string>('kilt.dappName'): |${this.configService.get<string>('kilt.dappName')}|\nthis.configService.get<string>('kilt.cTypeName'): |${this.configService.get<string>('kilt.cTypeName')}|\nthis.configService.get<string>('kilt.cTypeHash'): |${this.configService.get<string>('kilt.cTypeHash')}|\n`)

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
    async addAttestationKey() {
        console.log(`GET add_attestation_key\nprocess.env.KILT_WSS_ADDRESS: |${process.env.KILT_WSS_ADDRESS}|\nprocess.env.KILT_VERIFIER_MNEMONIC: |${process.env.KILT_VERIFIER_MNEMONIC}|\nprocess.env.KILT_VERIFIER_DID_URI: |${process.env.KILT_VERIFIER_DID_URI}|\nprocess.env.KILT_DAPP_NAME: |${process.env.KILT_DAPP_NAME}|\nprocess.env.KILT_CTYPE_NAME: |${process.env.KILT_CTYPE_NAME}|\nprocess.env.KILT_CTYPE_HASH: |${process.env.KILT_CTYPE_HASH}|\n\nthis.configService.get<string>('kilt.wssAddress'): |${this.configService.get<string>('kilt.wssAddress')}|\nthis.configService.get<string>('kilt.verifierMnemonic'): |${this.configService.get<string>('kilt.verifierMnemonic')}|\nthis.configService.get<string>('kilt.verifierDidUri'): |${this.configService.get<string>('kilt.verifierDidUri')}|\nthis.configService.get<string>('kilt.dappName'): |${this.configService.get<string>('kilt.dappName')}|\nthis.configService.get<string>('kilt.cTypeName'): |${this.configService.get<string>('kilt.cTypeName')}|\nthis.configService.get<string>('kilt.cTypeHash'): |${this.configService.get<string>('kilt.cTypeHash')}|\n`)

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
