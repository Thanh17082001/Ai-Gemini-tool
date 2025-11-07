import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './common/logger/logger.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env', // fallback
      ],
      expandVariables: true, // cho phép tham chiếu biến, ví dụ API_URL=${HOST}/api
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return ({
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 5,
          retryDelay: 3000,
          logger: 'advanced-console',
          logging: ['error', 'warn'], 
        })
      },
    }),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
