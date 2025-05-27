import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from '@/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PunchClocksRepository } from '@/repositories/punch-clocks-repository';
import { PrismaPunchClocksRepository } from './prisma/repositories/prisma-punch-clocks-repository';
import { SettingsRepository } from '@/repositories/settings-repository';
import { PrismaSettingsRepository } from './prisma/repositories/prisma-settings-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: PunchClocksRepository,
      useClass: PrismaPunchClocksRepository,
    },
    {
      provide: SettingsRepository,
      useClass: PrismaSettingsRepository,
    },
  ],
  exports: [
    UsersRepository,
    PunchClocksRepository,
    SettingsRepository,
    PrismaService,
  ],
})
export class DatabaseModule {}
