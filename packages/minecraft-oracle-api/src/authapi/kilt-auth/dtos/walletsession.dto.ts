import { DidResourceUri } from '@kiltprotocol/sdk-js';
import { ApiProperty } from '@nestjs/swagger';

export class WalletSessionDto {
    @ApiProperty({ description: 'encryptionKeyId' })
    encryptionKeyId: DidResourceUri;

    @ApiProperty({ description: 'nonce' })
    nonce: string;

    @ApiProperty({ description: 'encryptedWalletSessionChallenge' })
    encryptedWalletSessionChallenge: string;

    @ApiProperty({ description: 'sessionId' })
    sessionId: string;
}

