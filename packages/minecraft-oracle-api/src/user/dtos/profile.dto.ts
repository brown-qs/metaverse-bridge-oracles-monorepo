import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "src/common/enums/UserRole"

export class ProfileDto {
    
    @ApiProperty({ description: 'User UUID'})
    uuid: string

    @ApiProperty({ description: 'User name'})
    userName: string

    @ApiProperty({ description: 'User role'})
    role: UserRole

    @ApiProperty({ description: 'Bought the game or not'})
    hasGame: boolean

    @ApiProperty({ description: 'Is the user allowed to play'})
    allowedToPlay: boolean
}
