import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"


export class SnapshotDto {
    @ApiProperty({ description: 'Material name'})
    materialName: string

    @ApiProperty({ description: 'Number of units of the material'})
    amount: number

    @ApiPropertyOptional({ description: 'Position of item in user inventory if any'})
    position?: number
}

export class SnapshotsDto {
    @ApiProperty({ description: 'Snapshot array', type: [SnapshotDto]})
    snapshots: SnapshotDto[]

    @ApiPropertyOptional({ description: 'Game this snapshot belongs to'})
    gameId?: string
}
