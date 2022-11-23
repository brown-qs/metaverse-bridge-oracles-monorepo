import { ApiProperty } from "@nestjs/swagger"
import { IsAlphanumeric, IsBoolean, IsEnum, IsEthereumAddress, IsInt, IsJSON, IsLowercase, IsOptional, IsString } from "class-validator"
import { StringAssetType } from "../../common/enums/AssetType"
import { RecognizedAssetType } from "../../config/constants"

const EXAMPLE_METADATA = { "asset": { "assetAddress": "0xe4edcaaea73684b310fc206405ee80abcec73ee0", "assetId": "9603", "assetType": "ERC721", "chainId": 1285 }, "name": "Pondsama", "symbol": "PONDSAMA", "totalSupply": { "type": "BigNumber", "hex": "0x2587" }, "tokenURI": { "image": "https://moonsama.mypinata.cloud/ipfs/QmNr7bQ45eAsKRy7MhNSoA1NtRJnZmraLB5mJE2Eh6KPke/pondsama_organic_support.jpg", "name": "LAZY ORGANIC SPELLY", "description": "Harnessing ancient powers, Spelly commands the waters to aid its allies.", "external_url": "https://moonsama.com", "composite": false, "asset": { "assetType": "ERC721", "assetAddress": "0xe4edcaaea73684b310fc206405ee80abcec73ee0", "chainId": 1285 }, "attributes": [{ "trait_type": "Breed", "value": "Spelly" }, { "trait_type": "Type", "value": "Organic" }, { "trait_type": "Nature", "value": "Lazy" }, { "trait_type": "Passive", "value": "Pass the Baton" }, { "trait_type": "Skill", "value": "Timely Aid" }, { "display_type": "range_1_100", "trait_type": "HP", "value": 23 }, { "display_type": "range_1_100", "trait_type": "PW", "value": 16 }, { "display_type": "range_1_100", "trait_type": "DF", "value": 74 }, { "display_type": "range_1_100", "trait_type": "SP", "value": 72 }, { "trait_type": "Breed Counter", "value": 1 }, { "trait_type": "Gen", "value": 1 }], "image_meta": { "url": "https://moonsama.mypinata.cloud/ipfs/QmNr7bQ45eAsKRy7MhNSoA1NtRJnZmraLB5mJE2Eh6KPke/pondsama_organic_support.jpg", "ext": "jpg", "mime": "image/jpeg" } }, "contractURI": "ipfs://QmdCKgexLpBjST3FdWLbPZLH2FWRtu2NXE9dk5ZirdDRGb" }
export class StakedAssetDto {
    @ApiProperty({ description: 'Portal hash', example: "0x2676df387854ae95a53182e2df50b7cada9b822e8aed6a0005a190b9100c9999" })
    @IsAlphanumeric()
    @IsLowercase()
    portalHash: string

    @ApiProperty({ description: 'Enraptured', example: true })
    @IsBoolean()
    enraptured: boolean

    @ApiProperty({ description: 'Recognized asset type', enum: RecognizedAssetType, example: RecognizedAssetType.EXOSAMA })
    @IsEnum(RecognizedAssetType)
    recognizedAssetType: RecognizedAssetType

    @ApiProperty({ description: 'Amount as integer, eg wei if 18 decimals', example: "1000000000000000000" })
    @IsString()
    amount: string

    @ApiProperty({ description: 'NFT metadata, can potentially be null', example: EXAMPLE_METADATA, nullable: true })
    @IsJSON()
    metadata: unknown | null

    @ApiProperty({ description: 'Asset id, 0 for ERC20 or native tokens', example: 94 })
    @IsInt()
    assetId: number
}

export class StakedAssetWithCollectionInfoDto extends StakedAssetDto {
    @ApiProperty({ description: 'Chain id', example: 1285 })
    @IsInt()
    chainId: number

    @ApiProperty({ description: 'Asset type', example: StringAssetType.ERC721, enum: StringAssetType })
    @IsEnum(StringAssetType)
    assetType: StringAssetType

    @ApiProperty({ description: 'Asset address', example: "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a" })
    @IsEthereumAddress()
    @IsLowercase()
    assetAddress: string
}
