import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"


export class CallparamDto {

    @ApiProperty({ description: 'Hex-string encoded bytes of function input parameter'})
    @IsString()
    data: string

    @ApiProperty({ description: 'Hex-string encoded bytes of signature'})
    @IsString()
    signature: string
}

export class CallParamsDto {

    @ApiProperty({ description: 'List of call parameters'})
    params: CallparamDto[]
}
