import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class SummonDto {

    @ApiProperty({ description: 'Recipient of the asset'})
    @IsString()
    recipient: string;

    @ApiProperty({ description: 'Recipient of the asset'})
    @IsNumber()
    chainId: number;
}
