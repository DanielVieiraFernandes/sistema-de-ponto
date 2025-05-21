import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Register clock (E2E)', () => {
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

  test('[POST] api/punch-clock', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: hashSync('123456', 9),
        role: 'EMPLOYEE',
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const result = await request(app.getHttpServer())
      .post('/api/punch-clock')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'checkIn',
      });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      message: 'Ponto registrado com sucesso',
      timestamp: expect.any(String),
    });
  });
});
