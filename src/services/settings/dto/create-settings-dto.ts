import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDecimal, IsNumber, IsString, Matches } from 'class-validator';

export class CreateSettingsDto {
  @ApiProperty()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'O horário deve seguir o formato de 24 horas, ex: 23:59',
  })
  workday_hours: string;

  @ApiProperty()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'O horário deve seguir o formato de 24 horas, ex: 23:59',
  })
  overtime_rate: string;
}
