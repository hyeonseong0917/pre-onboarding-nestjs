import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {HttpExceptionFilter} from './common/filters/http-exception.filter';
import {TransformInterceptor} from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config=new DocumentBuilder()
  .setTitle('Todo API')
  .setDescription('NestJS Todo List API 문서')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document=SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
