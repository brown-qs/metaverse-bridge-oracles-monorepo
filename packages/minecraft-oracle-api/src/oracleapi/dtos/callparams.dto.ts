import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"


export class CallparamDto {
    @ApiProperty({ description: 'Hex-string hash of the asset entry in the metaverse' })
    @IsString()
    hash: string

    @ApiProperty({ description: 'Hex-string encoded bytes of function input parameter' })
    @IsString()
    data: string

    @ApiProperty({ description: 'Hex-string encoded bytes of signature' })
    @IsString()
    signature: string

    @ApiProperty({ description: 'Whether the action was acknowledged by the oracle or not' })
    @IsBoolean()
    confirmed: boolean
}

export class CallParamsDto {

    @ApiProperty({ description: 'List of call parameters', type: [CallparamDto] })
    params: CallparamDto[]
}
