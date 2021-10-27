import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { AssetDto } from "./asset.dto"

export class ImportDto {

    @ApiProperty({ description: 'Asset to import'})
    asset: AssetDto

    /*
    @ApiProperty({ description: 'Metaverse hash'})
    @IsString()
    metaverse: string
    */

    @ApiProperty({ description: 'Owner of the asset'})
    @IsString()
    owner: string

    @ApiProperty({ description: 'Beneficiary of the asset'})
    @IsString()
    beneficiary: string
    
    @ApiProperty({ description: 'Amount to import in wei'})
    @IsString()
    amount: string
}
