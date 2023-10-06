import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternalIntegrationModule } from './external-integration/external-integration.module';

@Module({
  imports: [ExternalIntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
