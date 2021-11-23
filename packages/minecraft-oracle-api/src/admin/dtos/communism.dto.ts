import { ApiProperty } from "@nestjs/swagger";

export class CommunismDto {

    @ApiProperty({ description: 'Min time the user needs to play to be eligible for gganbu shares'})
    minTimePlayed?: number

    @ApiProperty({ description: 'Gganbu share multiplier. Default: 1'})
    averageMultiplier?: number
}
