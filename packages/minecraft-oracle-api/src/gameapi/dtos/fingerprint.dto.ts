import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"


export class UserAssetFingerprint {

    @ApiProperty({ description: 'User uuid'})
    uuid: string

    @ApiProperty({ description: 'Fingerprint (hash) calculated out of the user assets.'})
    assetsFingerprint: string
}

export class UserAssetFingerprintsResult {

    @ApiProperty({ description: 'Fingerprints array', isArray: true})
    fingerprints: UserAssetFingerprint[]
}
