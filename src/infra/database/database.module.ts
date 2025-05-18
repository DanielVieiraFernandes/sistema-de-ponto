import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from 'src/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersRepository, PrismaService],
})
export class DatabaseModule {}
