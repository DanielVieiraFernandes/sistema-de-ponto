import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from 'src/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PunchClocksRepository } from 'src/repositories/punch-clocks-repository';
import { PrismaPunchClocksRepository } from './prisma/repositories/prisma-punch-clocks-repository';

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
  ],
  exports: [UsersRepository, PunchClocksRepository, PrismaService],
})
export class DatabaseModule {}
