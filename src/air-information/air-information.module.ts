import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';


@Module({

  providers: [AirInformationService],

})

export class ExternalIntegrationModule {}

