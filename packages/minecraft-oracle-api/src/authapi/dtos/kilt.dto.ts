import { ApiProperty } from '@nestjs/swagger';

export class WalletLoginApiDto {
    @ApiProperty({ description: 'Kilt wallet session id' })
    sessionId: string;
    message: WalletLoginMessageApi
}

export class WalletLoginMessageApi {
    @ApiProperty({ description: 'ciphertext' })
    ciphertext: string;

    @ApiProperty({ description: 'nonce' })
    nonce: string;

    @ApiProperty({ description: 'senderKeyId' })
    senderKeyId: string;

    @ApiProperty({ description: 'receiverKeyId' })
    receiverKeyId: string;
}