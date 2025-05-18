import supertest from 'supertest';
import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('Register User (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('[POST] api/users/register', async () => {
    console.log('Teste End to End de uma rota da aplicação');
  });
});
