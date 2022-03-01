import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetPlayerScoresDto {
  @ApiProperty({ description: 'Game id' })
  @IsString()
  gameId: string;

  @ApiPropertyOptional({ description: 'Page Number for pagination, starting at 1' })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Limit how many entries returned. Default is 50' })
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Specify column to be sorted. Score | Name' })
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort Direction. DESC | ASC' })
  @IsString()
  sort?: string;
}
