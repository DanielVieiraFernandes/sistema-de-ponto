import { Injectable } from '@nestjs/common';
import { PunchClocksRepository } from '@/repositories/punch-clocks-repository';
import { CreatePunchClockDto } from './dto/create-punch-clock-dto';
import { Either, right } from '@/config/errors/either';
import { FetchPunchClocksDto } from './dto/fetch-punch-clocks-dto';
import { HistoryPunchClockMapper } from '@/infra/database/prisma/mappers/history-punch-clock-mapper';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import { Paginated } from '@/utils/pagination/paginated';
import {
  RegisterMapper,
  RegisterMapperResponse,
} from '@/infra/database/prisma/mappers/register-mapper';
import { ReportJson } from '@/infra/database/prisma/value-objects/report-json';

@Injectable()
export class PunchClocksService {
  constructor(private punchClocksRepository: PunchClocksRepository) {}

  async registerClock(
    id: string,
    { type }: CreatePunchClockDto,
  ): Promise<
    Either<
      null,
      {
        timestamp: Date;
      }
    >
  > {
    const timestamp = new Date();

    await this.punchClocksRepository.create(id, type, timestamp);

    return right({
      timestamp,
    });
  }

  async fetchPunchClockHistory(
    id: string,
    page: number,
  ): Promise<
    Either<
      null,
      {
        points: HistoryPunchClockMapper[];
      }
    >
  > {
    const points = await this.punchClocksRepository.findAllHistoryByUserId(
      id,
      page,
    );

    return right({
      points,
    });
  }

  async fetchAllRegisters(
    dto: PaginationDto,
  ): Promise<Either<null, { registers: RegisterMapperResponse[] }>> {
    const registers = await this.punchClocksRepository.findAllByUserId(dto);

    return right({
      registers,
    });
  }

  async generateReport(dto: PaginationDto): Promise<
    Either<
      null,
      {
        report: ReportJson;
      }
    >
  > {
    const report = await this.punchClocksRepository.findAllAndReturnReport(dto);

    return right({
      report,
    });
  }
}
