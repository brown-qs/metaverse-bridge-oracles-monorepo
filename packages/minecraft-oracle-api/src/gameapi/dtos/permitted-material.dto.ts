import { ApiProperty } from "@nestjs/swagger"


export class PermittedMaterial {
    @ApiProperty({ description: 'Material name'})
    name: string
}

export class PermittedMaterials {

    @ApiProperty({ description: 'List of permitted materials', type: [PermittedMaterial]})
    materials: PermittedMaterial[]
}
