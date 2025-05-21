import { Injectable } from '@nestjs/common';
import { PunchClocksRepository } from 'src/repositories/punch-clocks-repository';
import { CreatePunchClockDto } from './dto/create-punch-clock-dto';
import { Either, right } from 'src/config/errors/either';
import { FetchPunchClocksDto } from './dto/fetch-punch-clocks-dto';
import { HistoryPunchClockMapper } from 'src/infra/database/prisma/mappers/history-punch-clock-mapper';

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
    { page }: FetchPunchClocksDto,
  ): Promise<
    Either<
      null,
      {
        points: HistoryPunchClockMapper[];
      }
    >
  > {
    const points = await this.punchClocksRepository.findAllByUserId(id, page);

    return right({
      points,
    });
  }
}
