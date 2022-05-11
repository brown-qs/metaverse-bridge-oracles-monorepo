import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class ConfigDto {

    @ApiProperty({ description: 'String. Example: Moonsama Topia: Beings'})
    @IsString()
    name: string
    
    @ApiProperty({ description: 'String. Example: Moonsama Topia: Beings from the hand of Ruben Topia. Creating a world full of temples, light and shadow in geometrical order.'})
    @IsString()
    description: string

    @ApiProperty({ description: 'String. Example: ipfs://QmVcBnfPsGfDrMRanCfX5gRVibkX9StgPLQF4cVmysRRsC' })
    image: string

    @ApiProperty({ description: 'String. Optional. Example: Ruben Topia' })
    artist: string

    @ApiProperty({ description: 'String. Optional. Example: https://www.rubentopia.com' })
    artist_url: string

    @ApiProperty({ description: 'String. Example: https://www.rubentopia.com' })
    external_link: string

}