import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './customeMiddlewares/logger.middlware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(logger);
  // const PORT: number = parseInt(process.env.PORT) || 3000;
  await app.listen(3000, () =>
    console.log(`Server is up and running on PORT http://localhost:${3000}`),
  );
}
bootstrap();
