import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '1',
    description: 'página dos registros',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    example: 20,
    description: 'quantidade de registros retornados',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  size: number;

  @ApiProperty({
    example: 'fdhajsjk-danskldna34-dfsnkl-msi34',
    description: 'filtrar pelo ID do funcionário',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId: string;

  @ApiProperty({
    example: new Date(),
    description: 'data inicial dos registros',
    required: false,
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    example: new Date(),
    description: 'data limite dos registros',
    required: false,
  })
  @IsDate()
  @IsOptional()
  endDate: Date;
}
