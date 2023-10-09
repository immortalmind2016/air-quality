import { Controller, Post } from '@nestjs/common';
import { AirInformationService } from '../air-information-service';
import { ApiExcludeController } from '@nestjs/swagger';
// paris zone geo info
const GEO_INFO = {
  lat: 31.00192,
  lon: 30.78847,
};

// We can use this controller in order to have internal calls (e.g. call an endpoint from kubernetes cronjob)
@Controller('air-information-internal')
@ApiExcludeController()
export class AirInformationInternalController {
  constructor(private readonly airInfoService: AirInformationService) {}

  // Being invoked internally by our services
  // So we won't add it to the swagger documentation
  @Post('execute-air-info-job')
  async executeAirInfoJob() {
    const response =
      await this.airInfoService.getNearestCityPollution(GEO_INFO);
    const pollution = response.Result.pollution;
    return this.airInfoService.storeGeoPollution(GEO_INFO, pollution);
  }
}
