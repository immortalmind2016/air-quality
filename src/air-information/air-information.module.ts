import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';
import { AirInformationController } from './air-information.controller';
import { ConfigModule } from '@nestjs/config';


@Module({

  providers: [AirInformationService],
  imports:[ConfigModule.forRoot(
    {
      // Add the .env for production as well once we have this environment
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
    }
  )],
  exports:[AirInformationService],
  controllers: [AirInformationController]

})

export class AirInformationModule {}

