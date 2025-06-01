import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';

describe('Register User (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  test('[POST] api/users/register', async () => {
    const result = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: '123456',
        role: 'EMPLOYEE',
      });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });
});
