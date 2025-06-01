import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './infra/env/env.service';
import { appSetup } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvService);
  const port = env.get('PORT');

  appSetup(app, env);

  await app.listen(port);
}
bootstrap();
