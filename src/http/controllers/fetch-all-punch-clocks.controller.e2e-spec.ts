import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Fetch All Punch Clocks (E2E)', () => {
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

  test('[POST] api/admin/punch-clock', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: hashSync('123456', 9),
        role: 'ADMIN',
      },
    });

    const userTwo = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: hashSync('123456', 9),
        role: 'EMPLOYEE',
      },
    });

    const userThree = await prisma.user.create({
      data: {
        name: 'Steve',
        email: 'steve@gmail.com',
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
        userId: userTwo.id,
        timestamp: checkInDate,
      },
    });

    await prisma.punchClock.create({
      data: {
        type: 'checkOut',
        userId: userTwo.id,
        timestamp: checkOutDate,
      },
    });

    await prisma.punchClock.create({
      data: {
        type: 'checkIn',
        userId: userThree.id,
        timestamp: checkInDate,
      },
    });

    await prisma.punchClock.create({
      data: {
        type: 'checkOut',
        userId: userThree.id,
        timestamp: checkOutDate,
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const result = await request(app.getHttpServer())
      .get('/api/admin/punch-clock')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: '1',
      });

    // console.log(result.error);

    expect(result.statusCode).toEqual(200);
    expect(result.body.registers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          employee: 'John Doe',
          hours_worked: 8,
        }),
        expect.objectContaining({
          employee: 'Steve',
          hours_worked: 8,
        }),
      ]),
    );
  });
});
