import { TypePunchClock } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreatePunchClockDto {
  @IsEnum(TypePunchClock)
  type: TypePunchClock;
}
