import { ApiProperty } from '@nestjs/swagger';

export class LoginApiDto {
    @ApiProperty({ description: 'User email' })
    email: string;

    @ApiProperty({ default: undefined, description: 'User password' })
    password: string;
}