import { PunchClock, TypePunchClock } from '@prisma/client';
import { HistoryPunchClockMapper } from '@/infra/database/prisma/mappers/history-punch-clock-mapper';
import { CreatePunchClockDto } from '@/services/punch-clocks/dto/create-punch-clock-dto';
import {
  RegisterMapper,
  RegisterMapperResponse,
} from '@/infra/database/prisma/mappers/register-mapper';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import { ReportJson } from '@/infra/database/prisma/value-objects/report-json';

export interface FetchPointsResponse {
  userName?: string | null;
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
  abstract findAllHistoryByUserId(
    userId: string,
    page: number,
  ): Promise<HistoryPunchClockMapper[]>;
  abstract findAllByUserId(
    dto: PaginationDto,
  ): Promise<RegisterMapperResponse[]>;
  abstract findAllAndReturnReport(dto: PaginationDto): Promise<ReportJson>;
}
