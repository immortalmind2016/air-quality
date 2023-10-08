import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  //we can replace the logger with external logger package like winston with kibana elastic search.
  const app = await NestFactory.create(AppModule,{logger:console});

  const config = new DocumentBuilder()
  .setTitle('Air Quality API')
  .setDescription('The Air Quality API description')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT||3000);
}
bootstrap();
