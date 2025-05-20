import { Injectable } from '@nestjs/common';
import { PunchClocksRepository } from 'src/repositories/punch-clocks-repository';
import { CreatePunchClockDto } from './dto/create-punch-clock-dto';
import { Either, right } from 'src/config/errors/either';

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
}
