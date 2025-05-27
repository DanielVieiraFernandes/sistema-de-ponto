import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { rejects } from 'assert';

describe('Generate Report in JSON (E2E)', () => {
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

  test('[GET] api/admin/report', async () => {
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
      .get('/api/admin/reports')
      .set('Authorization', `Bearer ${accessToken}`)

    // console.log(result.error);
    // console.log(result.body);

    expect(result.statusCode).toEqual(200);
  });
});
