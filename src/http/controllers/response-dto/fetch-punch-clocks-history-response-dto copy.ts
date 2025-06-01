import { ApiProperty } from '@nestjs/swagger';

class PunchClockPresenterDto {
  @ApiProperty({
    example: '2025-05-31',
    description: 'Data do registro no formato YYYY-MM-DD.',
  })
  date: string;

  @ApiProperty({
    name: 'check-in',
    example: '09:00',
    description: 'Horário de entrada no formato HH:mm.',
  })
  'check-in': string;

  @ApiProperty({
    name: 'check-out',
    example: '18:00',
    description: 'Horário de saída no formato HH:mm.',
  })
  'check-out': string;

  @ApiProperty({
    name: 'hours-worked',
    example: '8',
    description: 'Total de horas trabalhadas no dia.',
  })
  'hours-worked': string;
}

export class FetchPunchClocksHistoryResponseDto {
  @ApiProperty({
    type: [PunchClockPresenterDto],
    description: 'Lista de registros de ponto do funcionário.',
  })
  points: PunchClockPresenterDto[];
}
