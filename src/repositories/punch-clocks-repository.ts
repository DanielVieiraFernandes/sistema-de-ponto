import { PunchClock, TypePunchClock } from '@prisma/client';
import { HistoryPunchClockMapper } from '@/infra/database/prisma/mappers/history-punch-clock-mapper';
import { CreatePunchClockDto } from '@/services/punch-clocks/dto/create-punch-clock-dto';

export interface FetchPointsResponse {
  date: string;
  check_in: Date;
  check_out: Date;
}

export abstract class PunchClocksRepository {
  abstract create(
    id: string,
    type: TypePunchClock,
    timestamp: Date,
  ): Promise<PunchClock>;
  abstract findAllByUserId(
    userId: string,
    page: number,
  ): Promise<HistoryPunchClockMapper[]>;
}
