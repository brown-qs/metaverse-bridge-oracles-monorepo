import { ApiProperty } from "@nestjs/swagger";

export class AccountDto {

    @ApiProperty({ description: 'email' })
    email?: string

    @ApiProperty({ description: 'minecraft uuid or null if nothing linked' })
    minecraftUuid?: string
}
