import { ApiPropertyOptional } from "@nestjs/swagger"

export class BankDto {
    @ApiPropertyOptional({ description: 'Game ID of the snapshots to bank to bank. Default: null'})
    gameId?: string
}
