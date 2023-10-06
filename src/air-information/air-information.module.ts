import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';
import { AirInformationController } from './air-information.controller';


@Module({

  providers: [AirInformationService],
  exports:[AirInformationService],
  controllers: [AirInformationController]

})

export class AirInformationModule {}

