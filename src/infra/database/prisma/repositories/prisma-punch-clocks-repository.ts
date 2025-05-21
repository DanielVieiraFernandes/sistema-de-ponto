import { Injectable } from '@nestjs/common';
import { PunchClock, TypePunchClock } from '@prisma/client';
import {
  FetchPointsResponse,
  PunchClocksRepository,
} from '@/repositories/punch-clocks-repository';
import { PrismaService } from '../../prisma.service';
import { HistoryPunchClockMapper } from '../mappers/history-punch-clock-mapper';
import dayjs from 'dayjs';

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
      strftime('%Y-%m-%d', timestamp) AS date,
      MAX(CASE WHEN type = 'checkIn' THEN timestamp END) AS check_in,
      MAX(CASE WHEN type = 'checkOut' THEN timestamp END) AS check_out
    FROM punch_clocks
    WHERE userId = ?
    GROUP BY strftime('%Y-%m-%d', timestamp)
    HAVING COUNT(DISTINCT type) = 2
    ORDER BY date DESC
    LIMIT ? OFFSET ?;
    `,
        userId,
        20,
        (page - 1) * 20,
      );

    console.log('PunchClocks raw data:', punchClocks);

    return punchClocks.map((point) => {
      const checkInDate = new Date(Number(point.check_in));
      const checkOutDate = new Date(Number(point.check_out));

      const date = dayjs(checkInDate).format('YYYY-MM-DD');

      const hoursWorked = checkOutDate.getHours() - checkInDate.getHours();

      return HistoryPunchClockMapper.toHttp(
        { date, check_in: checkInDate, check_out: checkOutDate },
        hoursWorked,
      );
    });
  }
}
