import { ApiProperty } from "@nestjs/swagger"


export class PermittedMaterial {
    @ApiProperty({ description: 'Material name'})
    name: string

    @ApiProperty({ description: 'Material key'})
    key: string

    @ApiProperty({ description: 'Material ordinal'})
    ordinal: number
}

export class PermittedMaterials {

    @ApiProperty({ description: 'List of permitted materials', default: [], isArray: true})
    materials: PermittedMaterial[]
}
