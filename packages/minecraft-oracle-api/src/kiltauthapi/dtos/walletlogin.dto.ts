import { ApiProperty } from '@nestjs/swagger';

export class WalletLoginDto {
    @ApiProperty({ description: 'Kilt wallet session id' })
    sessionId: string;
    message: WalletLoginMessage
}

export class WalletLoginMessage {
    @ApiProperty({ description: 'ciphertext' })
    ciphertext: string;

    @ApiProperty({ description: 'nonce' })
    nonce: string;

    @ApiProperty({ description: 'senderKeyId' })
    senderKeyId: string;

    @ApiProperty({ description: 'receiverKeyId' })
    receiverKeyId: string;
}