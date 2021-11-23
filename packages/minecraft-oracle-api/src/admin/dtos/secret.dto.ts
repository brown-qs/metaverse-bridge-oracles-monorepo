import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class SecretDto {

    @ApiProperty({ description: 'Secret name to remember it by'})
    name: string;

    @ApiProperty({ description: 'Secret'})
    secret: string;
}

export class SecretNameDto {

    @ApiProperty({ description: 'Secret name to remember it by'})
    name: string;
}

export class SecretsDto {

    @ApiProperty({ description: 'List of secrets'})
    secrets: SecretDto[]
}
