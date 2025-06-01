import { ApiProperty } from '@nestjs/swagger';
import { TypePunchClock, UserRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

//  @ApiProperty({
//     enum: UserRole,
//     description: 'A função do usuário no sistema',
//     example: UserRole.EMPLOYEE,
//     enumName: 'UserRole',
//   })
//   @IsEnum(UserRole, { message: 'A função fornecida não é válida.' })
//   role: UserRole;

export class CreatePunchClockDto {
  @ApiProperty({
    enum: TypePunchClock,
    description: 'Entrada ou Saida do funcionário',
    example: TypePunchClock.checkIn,
    enumName: 'TypePunchClock',
  })
  @IsEnum(TypePunchClock, { message: 'O valor fornecido não é válido' })
  type: TypePunchClock;
}
