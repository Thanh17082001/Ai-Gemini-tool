import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import session from 'express-session';
import { hashKey } from './common/guards/hashKey';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lấy ConfigService từ ứng dụng NestJS
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const appName = configService.get<string>('app.name') || 'NestJS App';
  const dbname = configService.get<string>('database.name') || 'NOTCONECTED';
  const env = configService.get<string>('app.env') || 'development';
  const sessionSecret = configService.get<string>('app.sessionSecret') || 'defaultSecret';
  // Thiết lập session
  app.use(
    session({
      secret: sessionSecret, // 🔒 nên lưu .env
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 }, // 1 giờ
    }),
  );
 // Thiết lập CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // cho phép gửi cookie/token
  });


  // Thiết lập global prefix cho tất cả các route
  app.setGlobalPrefix('api'); 
  // Thiết lập Swagger
  const config = new DocumentBuilder()
    .setTitle('AI App API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    // .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
 

  // Thiết lập Winston Logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  //custom logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Thiết lập Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Thiết lập Global Transform Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Thiết lập ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // loại bỏ field không khai báo trong DTO
      forbidNonWhitelisted: true,
      transform: true,        // tự chuyển kiểu dữ liệu (string -> number)
    }),
  );

 
  await app.listen(process.env.PORT ?? 3000);

  console.log('===================================');
  console.log(`${appName} started successfully!`);
  console.log(`Environment: ${env}`);
  console.log(`App connected to database: ${dbname}`);
  console.log(`Server running at: http://localhost:${port}`);
  console.log('===================================');
}
bootstrap();
