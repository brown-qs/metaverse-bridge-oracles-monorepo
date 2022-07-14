import { DidPublicKey } from '@kiltprotocol/sdk-js';
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
    senderKeyUri: DidPublicKey['uri'];

    @ApiProperty({ description: 'receiverKeyUri' })
    receiverKeyUri: DidPublicKey['uri'];
}