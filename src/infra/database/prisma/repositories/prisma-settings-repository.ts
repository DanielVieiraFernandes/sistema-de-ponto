import { SettingsRepository } from '@/repositories/settings-repository';
import { CreateSettingsDto } from '@/services/settings/dto/create-settings-dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Settings } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { UpdateSettingsDto } from '@/services/settings/dto/update-settings-dto';

@Injectable()
export class PrismaSettingsRepository implements SettingsRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    overtime_rate,
    workday_hours,
  }: CreateSettingsDto): Promise<void> {
    const overtimeRate = Number(overtime_rate.replace(':', '.'));

    const workdayHours = Number(workday_hours.replace(':', '.'));

    if (isNaN(overtimeRate) || isNaN(workdayHours)) {
      throw new BadRequestException(
        'formato de horas inválido, verifique e tente novamente',
      );
    }

    await this.prisma.settings.create({
      data: {
        overtimeRate,
        workdayHours,
      },
    });
  }

  async findById(id: string): Promise<Settings | null> {
    return await this.prisma.settings.findUnique({
      where: {
        id,
      },
    });
  }

  async save(id: string,{
    overtime_rate,
    workday_hours,
  }: UpdateSettingsDto): Promise<Settings> {
    const overtimeRate = Number(overtime_rate.replace(':', '.'));
    const workdayHours = Number(workday_hours.replace(':', '.'));

    if (isNaN(overtimeRate) || isNaN(workdayHours)) {
      throw new BadRequestException(
        'formato de horas inválido, verifique e tente novamente',
      );
    }

    const data = { overtimeRate, workdayHours };

    return await this.prisma.settings.update({
      where: {
        id,
      },
      data,
    });
  }

  async findAnything(): Promise<Settings | null> {
    return await this.prisma.settings.findFirst({
      where: {
        workdayHours: {
          gt: 0,
        },
      },
    });
  }
}
