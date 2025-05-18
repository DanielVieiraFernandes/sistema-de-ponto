import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './infra/env/env.service';
import { appSetup } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  appSetup(app);

  const env = app.get(EnvService);
  const port = env.get('PORT');

  await app.listen(port);
}
bootstrap();
