import { Injectable } from '@nestjs/common';
import { PunchClock, TypePunchClock } from '@prisma/client';
import {
  FetchPointsResponse,
  PunchClocksRepository,
} from 'src/repositories/punch-clocks-repository';
import { PrismaService } from '../../prisma.service';
import { HistoryPunchClockMapper } from '../mappers/history-punch-clock-mapper';

@Injectable()
export class PrismaPunchClocksRepository implements PunchClocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    id: string,
    type: TypePunchClock,
    timestamp: Date,
  ): Promise<PunchClock> {
    return await this.prisma.punchClock.create({
      data: {
        userId: id,
        type,
        timestamp,
      },
    });
  }

  async findAllByUserId(
    userId: string,
    page: number,
  ): Promise<HistoryPunchClockMapper[]> {
    const punchClocks: FetchPointsResponse[] =
      await this.prisma.$queryRawUnsafe(
        `
  SELECT
    DATE(timestamp) AS day,
    MAX(CASE WHEN type = 'checkIn' THEN timestamp END) AS check_in,
    MAX(CASE WHEN type = 'checkOut' THEN timestamp END) AS check_out
  FROM punch_clocks
  WHERE userId = ?
  GROUP BY DATE(timestamp)
  HAVING COUNT(DISTINCT type) = 2
  ORDER BY day DESC
  LIMIT ? OFFSET ?;

`,
        userId,
        20,
        (page - 1) * 20,
      );

    return punchClocks.map((point) => {
      const hoursWorked =
        point.check_out.getHours() - point.check_in.getHours();

      return HistoryPunchClockMapper.toHttp(point, hoursWorked);
    });
  }
}
