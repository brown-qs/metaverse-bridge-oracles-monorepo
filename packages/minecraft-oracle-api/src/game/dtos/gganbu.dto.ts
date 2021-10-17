import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"


export class GganbuDto {

    @ApiProperty({ description: 'Player 1 of the gganbu pact'})
    @IsString()
    player1: string

    @ApiProperty({ description: 'Player 2 of the gganbu pact'})
    @IsString()
    player2: string
}

export class AreGganbusDto {

    @ApiProperty({ description: 'Gganbu flag'})
    @IsBoolean()
    areGganbus: boolean
}
