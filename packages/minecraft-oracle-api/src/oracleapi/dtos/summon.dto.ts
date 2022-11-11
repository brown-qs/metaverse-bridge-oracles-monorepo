import { ApiProperty } from "@nestjs/swagger"
import { IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class SummonDto {

    @ApiProperty({ description: 'Recipient of the asset' })
    @IsNotEmpty()
    @IsEthereumAddress()
    @IsString()
    recipient: string;

    @ApiProperty({ description: 'Recipient of the asset' })
    @IsNumber()
    chainId: number;
}
