import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../../common/enums/UserRole"
import { PlayEligibilityReason } from '../../config/constants'

export class ProfileDto {

    @ApiProperty({ description: 'User UUID' })
    uuid: string

    @ApiProperty({ description: 'Email' })
    email: string | null

    @ApiProperty({ description: 'Gamer Tag' })
    gamerTag: string | null

    @ApiProperty({ description: 'Mincraft UUID' })
    minecraftUuid: string | null

    @ApiProperty({ description: 'Minecraft user name' })
    minecraftUserName: string | null

    @ApiProperty({ description: 'Server Id' })
    serverId: string

    @ApiProperty({ description: 'User role' })
    role: UserRole

    @ApiProperty({ description: 'Bought the game or not' })
    hasGame: boolean

    @ApiProperty({ description: 'Is the user allowed to play' })
    allowedToPlay: boolean

    @ApiProperty({ description: 'Number of game pass eligible assets the user owns' })
    numGamePassAsset: number

    @ApiProperty({ description: 'Perferred server of user' })
    preferredServer: string

    @ApiProperty({ description: 'Whether the user is a VIP guest or not' })
    vip: boolean

    @ApiProperty({ description: 'Whether the user is blacklisted or not' })
    blacklisted: boolean

    @ApiProperty({ description: 'Whether the user is blacklisted or not' })
    allowedToPlayReason: PlayEligibilityReason
}
