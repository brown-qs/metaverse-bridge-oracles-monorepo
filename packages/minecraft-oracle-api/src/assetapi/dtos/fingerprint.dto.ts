import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class UsersAssetFingerprintQuery {

    @ApiProperty({ description: 'Pagination take. Number of users queried.', default: 100 })
    take: number

    @ApiProperty({ description: 'Pagination offset', default: 0 })
    offset: number

    @ApiPropertyOptional({ description: 'Specific user uuids (trimmed) to query instead of take and offset.'})
    specifics?: string[]
}


export class UserAssetFingerprint {

    @ApiProperty({ description: 'User uuid' })
    uuid: string

    @ApiProperty({ description: 'Fingerprint (hash) calculated out of the user assets.' })
    assetsFingerprint: string | undefined
}

export class UserAssetFingerprintsResult {

    @ApiProperty({ description: 'Fingerprints array', isArray: true })
    fingerprints: UserAssetFingerprint[]
}
