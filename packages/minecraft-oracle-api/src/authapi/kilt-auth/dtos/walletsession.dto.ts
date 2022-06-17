import { ApiProperty } from '@nestjs/swagger';

export class WalletSessionDto {
    @ApiProperty({ description: 'encryptionKeyId' })
    encryptionKeyId: string;

    @ApiProperty({ description: 'nonce' })
    nonce: string;

    @ApiProperty({ description: 'encryptedWalletSessionChallenge' })
    encryptedWalletSessionChallenge: string;

    @ApiProperty({ description: 'sessionId' })
    sessionId: string;
}

