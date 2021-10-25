import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"


export class ServerIdDto {

    @ApiProperty({ description: 'Server id'})
    @IsString()
    serverId: string
}
