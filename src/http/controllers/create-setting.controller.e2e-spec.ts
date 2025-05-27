import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Create setting (E2E)', () => {
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

  test('[POST] api/admin/setting', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: hashSync('123456', 9),
        role: 'ADMIN',
      },
    });

    // await prisma.settings.create({
    //   data: {
    //     overtimeRate: 12.2,
    //     workdayHours: 13.1,
    //   },
    // });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const result = await request(app.getHttpServer())
      .post('/api/admin/setting')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        workday_hours: '8:35',
        overtime_rate: '4:25',
      });

    console.log(result.error);

    expect(result.statusCode).toEqual(204);
  });
});
