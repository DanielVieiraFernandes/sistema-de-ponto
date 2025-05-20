import { PunchClock, TypePunchClock } from '@prisma/client';
import { CreatePunchClockDto } from 'src/services/punch-clocks/dto/create-punch-clock-dto';

export abstract class PunchClocksRepository {
  abstract create(
    id: string,
    type: TypePunchClock,
    timestamp: Date,
  ): Promise<PunchClock>;
}
