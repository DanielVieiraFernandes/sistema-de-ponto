import { EnvService } from '@/infra/env/env.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

export const swaggerSetup = (app: INestApplication, env: EnvService) => {
  const server = `${env.get('API_URL')}:${env.get('PORT')}`;

  const config = new DocumentBuilder()
    .setTitle('Sistema de Ponto')
    .setDescription('Sistema de Ponto eletrônico para empresas')
    .setVersion('1.0')
    .setContact(
      'Daniel Vieira',
      'https://github.com/DanielVieiraFernandes',
      'fernandesdanielvieira@gmail.com',
    )
    .addServer(server)
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
};

export const appSetup = (app: INestApplication, env: EnvService) => {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.use(cookieParser());
  swaggerSetup(app, env);
};
