import { ApiProperty } from '@nestjs/swagger';

class EmployeesDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do funcionário',
  })
  name: string;

  @ApiProperty({
    example: '48:00',
    description: 'Horas trabalhadas',
  })
  hours_worked: number;
}

export class GenerateReportsResponseDto {
  @ApiProperty({
    example: '500:00',
    description: 'Horas de todos os funcionários somadas',
  })
  total_hours: number;

  @ApiProperty({
    type: [EmployeesDto],
    description: 'Lista de funcionários com nome e horas trabalhadas',
  })
  employess: EmployeesDto[];
}
