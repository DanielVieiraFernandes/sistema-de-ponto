import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';

describe('Authenticate User (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  test('[POST] api/auth/login', async () => {
    await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: hashSync('123456', 9),
        role: 'EMPLOYEE',
      },
    });

    const result = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'daniel@gmail.com',
        password: '123456',
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
