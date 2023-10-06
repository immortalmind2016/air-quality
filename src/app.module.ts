import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirInformationModule } from './air-information/air-information.module';

@Module({
  imports: [AirInformationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
