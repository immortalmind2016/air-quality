import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AirInformationModule } from './air-information/air-information.module';

@Module({
  imports: [AirInformationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
