import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirInformationModule } from './air-information/air-information.module';
import { AirInformationInternalController } from './air-information.internal/air-information.internal.controller';

@Module({
  imports: [AirInformationModule],
  controllers: [AppController, AirInformationInternalController],
  providers: [AppService],
})
export class AppModule {}
