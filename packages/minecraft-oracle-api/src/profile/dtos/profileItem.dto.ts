import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"


export class ProfileItemDto {
     
    @ApiProperty({ description: 'Asset name'})
    @IsString()
    name: string

    @ApiProperty({ description: 'Asset address'})
    @IsString()
    assetAddress: string

    @ApiProperty({ description: 'Asset id, aka token id'})
    @IsString()
    assetId: string

    @ApiProperty({ description: 'Asset type, aka token type'})
    @IsString()
    assetType: string

    @ApiProperty({ description: 'Amount of the asset in ether'})
    @IsString()
    amount: string

    @ApiProperty({ description: 'Whether the asset can be exported as a token.'})
    @IsBoolean()
    exportable: boolean

    @ApiProperty({ description: 'Whether the asset can be summoned as a token.'})
    @IsBoolean()
    summonable: boolean

    @ApiProperty({ description: 'Hash of the entry. Needed for exports.'})
    @IsString()
    hash?: string
}

export class ProfileItemsDto {

    @ApiProperty({ description: 'Imported or enraptured tickets', isArray: true})
    tickets: ProfileItemDto[]

    @ApiProperty({ description: 'Imported moonsamas', isArray: true})
    moonsamas: ProfileItemDto[]

    @ApiProperty({ description: 'In-game resources available to summon', isArray: true })
    resources: ProfileItemDto[]
}
