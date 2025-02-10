import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfig, Environment } from './config/app.config';
import { seedDatabase } from './scripts/seed-database';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await seedDatabase();

  const configService = app.get(ConfigService<AppConfig>);
  const isProd = configService.get('env') === Environment.Production;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: true,
      disableErrorMessages: isProd,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(helmet());
  app.enableCors();

  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Octane API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get('port'));
}

bootstrap();
