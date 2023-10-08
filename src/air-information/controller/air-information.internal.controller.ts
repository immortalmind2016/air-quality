import { Controller, Post } from '@nestjs/common';
import { AirInformationService } from '../air-information-service';

const GEO_INFO={
    lat:48.856613,
    lon:2.352222
}

// We can use this controller in order to have internal calls (e.g. call an endpoint from kubernetes cronjob)
@Controller('air-information.internal')
export class AirInformationInternalController {

    constructor(private readonly airInfoService:AirInformationService){}

    // Being invoked internally by kubernetes cronjob every x minutes
    // So we won't add it to the swagger documentation
    @Post("execute-air-info-job")
    async executeAirInfoJob(){
        const response= await this.airInfoService.getNearestCityPopulation(GEO_INFO);
        const pollution=response.Result.pollution
        return this.airInfoService.storeGeoPollution(GEO_INFO,pollution)
    }
}
