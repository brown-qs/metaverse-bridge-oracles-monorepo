import { ApiProperty } from "@nestjs/swagger";

export class CommunismDto {

    @ApiProperty({ description: 'Min time the user needs to play to be eligible for gganbu shares'})
    minTimePlayed?: number

    @ApiProperty({ description: 'Multiplier [0,1] on how much of the averaged resources is distributed. Default: 1'})
    averageMultiplier?: number

    @ApiProperty({ description: 'Multiplier [0,1] on how much of the user resources are taken away. Default: 0.5'})
    deduction?: number

    @ApiProperty({ description: 'server ID to check time played for. Default: production'})
    serverId?: string

    @ApiProperty({ description: 'Redistribution only for Moonsamas. Default: true'})
    moonsamasOnly?: boolean

    @ApiProperty({ description: 'Deduction from everyone for gganbu. Default: true'})
    deductFromEveryone?: boolean
}