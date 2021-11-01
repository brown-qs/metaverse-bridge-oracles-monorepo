import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export enum ConfirmTypeDto {
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

    @ApiProperty({ description: 'Confirm type'})
    type: ConfirmTypeDto;
}

export class AdminConfirmsDto {

    @ApiProperty({ description: 'List of confirmation actions'})
    confirms: AdminConfirmDto[]
}