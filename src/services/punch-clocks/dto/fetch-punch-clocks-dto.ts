import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FetchPunchClocksDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
