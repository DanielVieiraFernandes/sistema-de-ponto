import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({});
  }

  async onModuleInit() {
    return this.$connect();
  }
  async onModuleDestroy() {
    return this.$disconnect();
  }
}
