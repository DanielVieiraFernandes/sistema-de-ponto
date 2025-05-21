import { PunchClock, TypePunchClock } from '@prisma/client';
import { HistoryPunchClockMapper } from 'src/infra/database/prisma/mappers/history-punch-clock-mapper';
import { CreatePunchClockDto } from 'src/services/punch-clocks/dto/create-punch-clock-dto';

export interface FetchPointsResponse {
  day: Date;
  check_in: Date;
  check_out: Date;
}

export abstract class PunchClocksRepository {
  abstract create(
    id: string,
    type: TypePunchClock,
    timestamp: Date,
  ): Promise<PunchClock>;
  abstract findAllByUserId(userId: string, page: number): Promise<HistoryPunchClockMapper[]>;
}
