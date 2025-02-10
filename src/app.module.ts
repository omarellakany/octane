import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { AppAuthGuard } from './auth/guards/auth.guard';
import { BookModule } from './book/book.module';
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import appConfig, { AppConfig } from './config/app.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        return {
          type: 'postgres',
          url: configService.get('dbUrl'),
          synchronize: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),

    CqrsModule.forRoot(),
    AuthModule,
    UserModule,
    BookModule,
  ],
  providers: [
    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SnakeCaseInterceptor,
    },

    // Guards
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
