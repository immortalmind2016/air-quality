import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternalIntegrationModule } from './air-information/air-information.module';

@Module({
  imports: [ExternalIntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
