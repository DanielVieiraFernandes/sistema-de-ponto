import { BadRequestException, Injectable } from '@nestjs/common';
import { PunchClock, TypePunchClock } from '@prisma/client';
import {
  FetchPointsResponse,
  PunchClocksRepository,
} from '@/repositories/punch-clocks-repository';
import { PrismaService } from '../../prisma.service';
import { HistoryPunchClockMapper } from '../mappers/history-punch-clock-mapper';
import dayjs from 'dayjs';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import {
  RegisterMapper,
  RegisterMapperResponse,
} from '../mappers/register-mapper';
import { Paginated } from '@/utils/pagination/paginated';
import { ReportJson } from '../value-objects/report-json';
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

  async findAllByUserId(dto: PaginationDto): Promise<RegisterMapperResponse[]> {
    const paginated = new Paginated(dto);

    const limit = paginated.skip;
    const offset = paginated.take;

    const params: any[] = [];
    let whereClausule = '';

    if (paginated.employeeId) {
      whereClausule = `WHERE pc.userId = ?`;
      params.push(paginated.employeeId);
    }

    params.push(limit);
    params.push(offset);

    const query = `
      SELECT
        u.name AS "userName",                         
        strftime('%Y-%m-%d', pc.timestamp / 1000, 'unixepoch') AS "date", 
        MAX(CASE WHEN pc.type = 'checkIn' THEN pc.timestamp END) AS check_in, 
        MAX(CASE WHEN pc.type = 'checkOut' THEN pc.timestamp END) AS check_out 
      FROM
        punch_clocks AS pc                        
      INNER JOIN
        users AS u ON pc.userId = u.id            
      ${whereClausule}                            
      GROUP BY
        pc.userId, u.name, "date"                
      HAVING
        COUNT(DISTINCT pc.type) = 2
      ORDER BY
        "date" DESC, pc.userId DESC               
      LIMIT ? OFFSET ?;                           
    `;

    const punchClocks: FetchPointsResponse[] =
      await this.prisma.$queryRawUnsafe(query, ...params);
    console.log('Query Result:', punchClocks);
    console.log('SQL Query:', query);
    console.log('SQL Params:', params);

    return punchClocks.map((punchClock) => {
      const date = punchClock.date;
      const check_in = new Date(Number(punchClock.check_in));
      const check_out = new Date(Number(punchClock.check_out));

      const hoursWorked = check_out.getHours() - check_in.getHours();

      const historyPunchClockMapper = HistoryPunchClockMapper.toHttp(
        {
          date,
          check_in,
          check_out,
        },
        hoursWorked,
      );

      if (!punchClock.userName) {
        throw new BadRequestException('unnamed user');
      }

      return RegisterMapper.toHttp(
        historyPunchClockMapper,
        punchClock.userName,
      );
    });
  }

  async findAllHistoryByUserId(
    userId: string,
    page: number,
  ): Promise<HistoryPunchClockMapper[]> {
    const punchClocks: FetchPointsResponse[] =
      await this.prisma.$queryRawUnsafe(
        `
    SELECT
      MAX(CASE WHEN type = 'checkIn' THEN timestamp END) AS check_in,
      MAX(CASE WHEN type = 'checkOut' THEN timestamp END) AS check_out
    FROM punch_clocks
    WHERE userId = ?
    GROUP BY strftime('%Y-%m-%d', timestamp)
    HAVING COUNT(DISTINCT type) = 2
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?;
    `,
        userId,
        20,
        (page - 1) * 20,
      );

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

  async findAllAndReturnReport(dto: PaginationDto): Promise<ReportJson> {
    const paginated = new Paginated(dto);

    const params: any[] = [];
    let whereClausule = '';

    if (paginated.employeeId) {
      whereClausule = `WHERE pc.userId = ?`;
      params.push(paginated.employeeId);
    }

    // Alterar a query para fazer com o método SUM do banco
    const query = `
      SELECT
        u.name AS "userName",                         
        strftime('%Y-%m-%d', pc.timestamp / 1000, 'unixepoch') AS "date", 
        MAX(CASE WHEN pc.type = 'checkIn' THEN pc.timestamp END) AS check_in, 
        MAX(CASE WHEN pc.type = 'checkOut' THEN pc.timestamp END) AS check_out 
      FROM
        punch_clocks AS pc                        
      INNER JOIN
        users AS u ON pc.userId = u.id            
      ${whereClausule}                            
      GROUP BY
        pc.userId, u.name, "date"                
      HAVING
        COUNT(DISTINCT pc.type) = 2
      ORDER BY
        "date" DESC, pc.userId DESC                                          
    `;

    const punchClocks: FetchPointsResponse[] =
      await this.prisma.$queryRawUnsafe(query, ...params);

    const totalHours = punchClocks.reduce((acc, value) => {
      const checkInDate = new Date(Number(value.check_in));
      const checkOutDate = new Date(Number(value.check_out));
      const hoursWorked = checkOutDate.getHours() - checkInDate.getHours();
      acc += hoursWorked;

      console.log('Acumulator: ', acc);

      return acc;
    }, 0);

    const report = ReportJson.create(
      totalHours,
      punchClocks.map((employe) => {
        if (!employe.userName) throw new BadRequestException('unamed user');
        const checkInDate = new Date(Number(employe.check_in));
        const checkOutDate = new Date(Number(employe.check_out));

        const name = employe.userName;
        const hoursWorked = checkOutDate.getHours() - checkInDate.getHours();

        return {
          name,
          hours_worked: hoursWorked,
        };
      }),
    );

    return report;
  }
}
