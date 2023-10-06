import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //we can replace the logger with external logger package like winston with kibana elastic search.
  const app = await NestFactory.create(AppModule,{logger:console});
  await app.listen(3000);
}
bootstrap();
