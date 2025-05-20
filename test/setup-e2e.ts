import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { unlinkSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

const dbFileName = `${randomUUID()}.sqlite`;

const dbFilePath = resolve(__dirname, '..', 'test', 'database', dbFileName);

const dbUrl = `file:${dbFilePath}`;

beforeAll(() => {
  mkdirSync(resolve(__dirname, '..', 'test', 'database'), { recursive: true });

  process.env.DATABASE_URL = dbUrl;

  execSync('yarn prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$disconnect();

  try {
    unlinkSync(dbFilePath);
  } catch (error) {
    console.error('Erro ao deletar banco nos testes: ', error);
  }
});
