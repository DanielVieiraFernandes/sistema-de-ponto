import { BadRequestException, Injectable } from '@nestjs/common';
import { PunchClock, TypePunchClock } from '@prisma/client';
import {
  FetchPointsResponse,
  PunchClocksRepository,
} from '@/repositories/punch-clocks-repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service'; // Importe o Prisma para usar o Prisma.sql
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
    // O método create não precisa de raw query e já é compatível.
    return this.prisma.punchClock.create({
      data: {
        userId: id,
        type,
        timestamp,
      },
    });
  }

  async findAllByUserId(dto: PaginationDto): Promise<RegisterMapperResponse[]> {
    const paginated = new Paginated(dto);
    const {
      employeeId,
      startDate,
      endDate,
      skip: offset,
      take: limit,
    } = paginated;

    // Usando Prisma.sql para segurança contra SQL Injection
    let whereConditions = [Prisma.sql`1=1`]; // Condição base

    if (employeeId) {
      whereConditions.push(Prisma.sql`pc."userId" = ${employeeId}`);
    }
    if (startDate) {
      whereConditions.push(Prisma.sql`pc.timestamp >= ${startDate}`);
    }
    if (endDate) {
      whereConditions.push(Prisma.sql`pc.timestamp <= ${endDate}`);
    }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(whereConditions, ' AND ')}`;

    // A query agora calcula as horas trabalhadas diretamente no banco de dados.
    const query = Prisma.sql`
      WITH daily_punch_clocks AS (
        SELECT
          u.name AS "userName",
          pc."userId",
          pc.timestamp::date AS "date",
          MAX(CASE WHEN pc.type = 'checkIn' THEN pc.timestamp END) AS check_in,
          MAX(CASE WHEN pc.type = 'checkOut' THEN pc.timestamp END) AS check_out
        FROM
          punch_clocks AS pc
        INNER JOIN
          users AS u ON pc."userId" = u.id
        ${whereClause}
        GROUP BY
          u.name, pc."userId", pc.timestamp::date
        HAVING
          COUNT(DISTINCT pc.type) >= 2
      )
      SELECT
        "userName",
        to_char("date", 'YYYY-MM-DD') AS "date",
        check_in,
        check_out,
        -- Calcula a diferença em segundos e converte para horas decimais
        EXTRACT(EPOCH FROM (check_out - check_in)) / 3600 AS "hoursWorked"
      FROM
        daily_punch_clocks
      ORDER BY
        "date" DESC, "userId" DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Usando $queryRaw em vez de $queryRawUnsafe
    const punchClocks: (FetchPointsResponse & { hoursWorked: number })[] =
      await this.prisma.$queryRaw(query);

    return punchClocks.map((punchClock) => {
      // O mapeamento agora é muito mais simples
      const historyPunchClockMapper = HistoryPunchClockMapper.toHttp(
        {
          date: punchClock.date,
          check_in: punchClock.check_in,
          check_out: punchClock.check_out,
        },
        punchClock.hoursWorked, // hoursWorked já vem calculado
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
    const limit = 20;
    const offset = (page - 1) * limit;

    const punchClocks: (FetchPointsResponse & { hoursWorked: number })[] =
      await this.prisma.$queryRaw(Prisma.sql`
        WITH daily_punches AS (
          SELECT
            "timestamp"::date as "date",
            MAX(CASE WHEN type = 'checkIn' THEN "timestamp" END) AS check_in,
            MAX(CASE WHEN type = 'checkOut' THEN "timestamp" END) AS check_out
          FROM punch_clocks
          WHERE "userId" = ${userId}
          GROUP BY "timestamp"::date
          HAVING COUNT(DISTINCT type) >= 2
        )
        SELECT
          to_char("date", 'YYYY-MM-DD') as "date",
          check_in,
          check_out,
          EXTRACT(EPOCH FROM (check_out - check_in)) / 3600 AS "hoursWorked"
        FROM daily_punches
        ORDER BY "date" DESC
        LIMIT ${limit} OFFSET ${offset};
      `);

    return punchClocks.map((point) => {
      return HistoryPunchClockMapper.toHttp(
        {
          date: point.date,
          check_in: point.check_in,
          check_out: point.check_out,
        },
        point.hoursWorked,
      );
    });
  }

  async findAllAndReturnReport(dto: PaginationDto): Promise<ReportJson> {
    const paginated = new Paginated(dto);
    const { employeeId, startDate, endDate } = paginated;

    let whereConditions = [Prisma.sql`1=1`];
    if (employeeId) {
      whereConditions.push(Prisma.sql`pc."userId" = ${employeeId}`);
    }
    if (startDate) {
      whereConditions.push(Prisma.sql`pc.timestamp >= ${startDate}`);
    }
    if (endDate) {
      whereConditions.push(Prisma.sql`pc.timestamp <= ${endDate}`);
    }
    const whereClause = Prisma.sql`WHERE ${Prisma.join(whereConditions, ' AND ')}`;

    const result: {
      totalHours: number;
      reportData: { name: string; hours_worked: number }[] | null;
    }[] = await this.prisma.$queryRaw`
        WITH daily_hours AS (
          SELECT
            u.name,
            EXTRACT(EPOCH FROM (
              MAX(CASE WHEN pc.type = 'checkOut' THEN pc.timestamp END) -
              MAX(CASE WHEN pc.type = 'checkIn' THEN pc.timestamp END)
            )) / 3600 AS hours_worked
          FROM punch_clocks pc
          JOIN users u ON u.id = pc."userId"
          ${whereClause}
          GROUP BY u.name, pc.timestamp::date
          HAVING COUNT(DISTINCT pc.type) >= 2
        ),
        aggregated_report AS (
          SELECT
            name,
            SUM(hours_worked) as hours_worked
          FROM daily_hours
          GROUP BY name
        )
        SELECT
          (SELECT SUM(hours_worked) FROM aggregated_report) as "totalHours",
          json_agg(json_build_object('name', name, 'hours_worked', hours_worked)) as "reportData"
        FROM aggregated_report
    `;

    const reportData = result[0];

    return ReportJson.create(
      reportData.totalHours || 0,
      reportData.reportData || [],
    );
  }
}
