import { Injectable } from '@nestjs/common';
import { PunchClock, TypePunchClock } from '@prisma/client';
import { PunchClocksRepository } from 'src/repositories/punch-clocks-repository';
import { PrismaService } from '../../prisma.service';

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
}
