import { ApiProperty } from "@nestjs/swagger";
import { AuthProvider } from "src/authapi/jwt.strategy";

export class AccountDto {

    @ApiProperty({ description: 'Auth provider' })
    provider: AuthProvider

    @ApiProperty({ description: 'email' })
    email?: string

    @ApiProperty({ description: 'minecraft uuid or null if nothing linked' })
    minecraftUuid?: string
}
