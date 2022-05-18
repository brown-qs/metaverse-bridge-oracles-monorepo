import { ApiProperty } from "@nestjs/swagger"
import { ChainAssetDto } from "./chainasset.dto"

export class SaveCompositeConfigDto {

    @ApiProperty({ description: 'Children assets of the composite parent'})
    compositeChildren: ChainAssetDto[]
    
    @ApiProperty({ description: 'Composite parent asset'})
    compositeParent: ChainAssetDto
}
