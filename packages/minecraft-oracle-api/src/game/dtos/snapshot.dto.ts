import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt } from "class-validator"


export class Snapshot {
    @ApiProperty({ description: 'Material name'})
    materialName: string

    @ApiProperty({ description: 'Number of units of the material'})
    @IsInt()
    amount: number

    @ApiPropertyOptional({ description: 'Position of item in user inventory if any'})
    @IsInt()
    position?: number
}

export class Snapshots {
    @ApiProperty({ description: 'Snapshot array', default: [], isArray: true})
    snapshots: Snapshot[]

    @ApiPropertyOptional({ description: 'Uuid of user the snapshots belong to'})
    uuid?: string
}
