import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt } from "class-validator"


export class SnapshotDto {
    @ApiProperty({ description: 'Material name'})
    materialName: string

    @ApiProperty({ description: 'Number of units of the material'})
    @IsInt()
    amount: number

    @ApiPropertyOptional({ description: 'Position of item in user inventory if any'})
    @IsInt()
    position?: number
}

export class SnapshotsDto {
    @ApiProperty({ description: 'Snapshot array', type: [SnapshotDto]})
    snapshots: SnapshotDto[]
}
