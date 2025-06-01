import { ApiProperty } from '@nestjs/swagger';

class RegisterPresenterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do funcionário que fez o registro.',
  })
  employee: string;

  @ApiProperty({
    example: '2025-05-30',
    description: 'Data do registro no formato YYYY-MM-DD.',
  })
  date: string;

  @ApiProperty({
    name: 'check-in',
    example: '09:01',
    description: 'Horário de entrada no formato HH:mm.',
  })
  'check-in': string;

  @ApiProperty({
    name: 'check-out',
    example: '18:05',
    description: 'Horário de saída no formato HH:mm.',
  })
  'check-out': string;

  @ApiProperty({
    example: '8h 4m',
    description: 'Total de horas trabalhadas no dia.',
  })
  hours_worked: string;
}
export class FetchAllPunchClocksResponseDto {
  @ApiProperty({
    type: [RegisterPresenterDto],
    description: 'Lista de registros de ponto do funcionário.',
  })
  registers: RegisterPresenterDto[];
}
