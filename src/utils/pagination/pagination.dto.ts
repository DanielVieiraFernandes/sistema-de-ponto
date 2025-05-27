import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1) 
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  size: number;

  @IsOptional()
  @IsString()
  employeeId: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
