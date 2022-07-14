import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
    @ApiProperty({ description: 'success' })
    @IsBoolean()
    success: boolean;

    @ApiProperty({ description: 'jwt' })
    @IsNotEmpty()
    @IsString()
    @IsJWT()
    "jwt": string
}

