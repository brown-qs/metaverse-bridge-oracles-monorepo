import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, IsObject, IsNumber } from "class-validator"
import { ConfigDto } from "src/exoconfig/dtos/config.dto"
import { Type } from 'class-transformer';

export class AttributeDto {

    @ApiProperty({ description: 'String. Example: Minecraft Skin'})
    @IsString()
    trait_type : string
    
    @ApiProperty({ description: 'String. Example: ipfs://QmeQwmw5Dhsvcxyy9KELjhzW23A2ZAPfHKQeuLnt83vxB6'})
    @IsString()
    value: string

    @IsNumber()
    configId?: string;

    @IsObject()
    @Type(() => ConfigDto)
    config: ConfigDto;
}