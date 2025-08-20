import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/inteptors/response.interceptor';
import { HttpExceptionFilter } from './common/inteptors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Global Interceptor (success response format)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Exception Filter (error response format)
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
