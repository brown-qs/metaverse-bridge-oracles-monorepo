import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsString } from "class-validator"

export class PreferredServerDto {

    @ApiProperty({ description: 'Preferred server for the user', isArray: true})
    @IsString()
    preferredServer: string

    @ApiProperty({ description: 'User uuid to set preferred server to'})
    @IsString()
    uuid: string
}

export class PreferredServersDto {

    @ApiProperty({ description: 'Preferred server for the user', isArray: true})
    @IsArray()
    preferredServers: PreferredServerDto[]
}
