import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FetchPunchClocksDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
