import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../../common/enums/UserRole"

export class ProfileDto {
    
    @ApiProperty({ description: 'User UUID'})
    uuid: string

    @ApiProperty({ description: 'User name'})
    userName: string

    @ApiProperty({ description: 'Server Id'})
    serverId: string

    @ApiProperty({ description: 'User role'})
    role: UserRole

    @ApiProperty({ description: 'Bought the game or not'})
    hasGame: boolean

    @ApiProperty({ description: 'Is the user allowed to play'})
    allowedToPlay: boolean

    @ApiProperty({ description: 'Number of tickets the user has imported/burned'})
    numTicket: number

    @ApiProperty({ description: 'Number of moonsamas the user has imported'})
    numMoonsama: number

    @ApiProperty({ description: 'Perferred server of user'})
    preferredServer: string
}
