import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export enum OracleActionTypeDto {
    ENRAPTURE='enrapture',
    SUMMON = 'summon',
    EXPORT = 'export',
    IMPORT = 'import'
}

export class AdminConfirmDto {

    @ApiProperty({ description: 'User uuid'})
    uuid: string;

    @ApiProperty({ description: 'Hash to confirm'})
    hash: string;

    @ApiProperty({ description: 'Confirm type', enum: OracleActionTypeDto})
    type: OracleActionTypeDto;

    @ApiProperty({ description: 'ChainId'})
    chainId: number;
}

export class AdminConfirmsDto {

    @ApiProperty({ description: 'List of confirmation actions', type: [AdminConfirmDto]})
    confirms: AdminConfirmDto[]
}