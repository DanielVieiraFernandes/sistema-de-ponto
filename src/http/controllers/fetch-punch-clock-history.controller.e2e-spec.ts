import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

describe('Fetch Punch Clocks (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  test('[POST] api/punch-clock/history', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: hashSync('123456', 9),
        role: 'EMPLOYEE',
      },
    });

    const checkInDate = new Date();
    checkInDate.setHours(9, 0, 0, 0);

    const checkOutDate = new Date(checkInDate.getTime() + 8 * 60 * 60 * 1000);

    await prisma.punchClock.create({
      data: {
        type: 'checkIn',
        userId: user.id,
        timestamp: checkInDate,
      },
    });

    await prisma.punchClock.create({
      data: {
        type: 'checkOut',
        userId: user.id,
        timestamp: checkOutDate,
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const result = await request(app.getHttpServer())
      .get('/api/punch-clock/history')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: '1',
      });

    // console.log(result.error);
    // console.log(result.body.points);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({
      points: expect.arrayContaining([
        expect.objectContaining({
          date: dayjs(checkInDate).format('YYYY-MM-DD'),
        }),
      ]),
    });
  });
});
