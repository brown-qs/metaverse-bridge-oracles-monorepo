import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class SnapshotDto {
    @ApiProperty({ description: 'Material name'})
    materialName: string

    @ApiProperty({ description: 'Number of units of the material'})
    amount: number

    @ApiPropertyOptional({ description: 'Position of item in user inventory if any'})
    position?: number
}

export class UserSnapshotsDto {
    @ApiProperty({ description: 'Snapshot array', isArray: true, type: SnapshotDto})
    snapshots: SnapshotDto[]

    @ApiPropertyOptional({ description: 'Game this snapshot belongs to: Default: NULL.'})
    gameId?: string

    @ApiPropertyOptional({ description: 'User playtime in miliseconds: Default: 0.'})
    playTime?: number

    @ApiPropertyOptional({ description: 'User power. Default: 0.'})
    power?: number

    @ApiPropertyOptional({ description: 'Whether to add the playtime to the existing one if already has. Default: false'})
    accumulatePlayTime?: boolean

    @ApiProperty({ description: 'Trimmed uuid the snapshots belong to.'})
    uuid: string
}

export class SnapshotsDto {
    @ApiProperty({ description: 'Snapshot array', isArray: true, type: SnapshotDto})
    snapshots: SnapshotDto[]

    @ApiPropertyOptional({ description: 'Game this snapshot belongs to: Default: NULL.'})
    gameId?: string

    @ApiPropertyOptional({ description: 'User playtime in miliseconds: Default: 0.'})
    playTime?: number

    @ApiPropertyOptional({ description: 'User power. Default: 0.'})
    power?: number

    @ApiPropertyOptional({ description: 'Whether to add the playtime to the existing one if already has. Default: false'})
    accumulatePlayTime?: boolean
}

export class BulkSnapshotRequestDto {

    @ApiProperty({ description: 'Snapshot entries.', isArray: true, type: UserSnapshotsDto})
    entries: UserSnapshotsDto[]
}
