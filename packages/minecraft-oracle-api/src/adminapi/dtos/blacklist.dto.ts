import { ApiProperty } from "@nestjs/swagger";

export class BlacklistDto {

    @ApiProperty({ description: 'Sets blacklist for the user'})
    blacklist: boolean
}
