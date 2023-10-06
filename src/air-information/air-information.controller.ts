import { Controller, Get } from '@nestjs/common';
import { AirInformationService } from './air-information-service';
import { AirPollutionGeoInfoDTO } from './dto/air-information.dto';
import { AirPollutionResult } from './types';

@Controller('air-information')
export class AirInformationController {
    constructor(private readonly airInformationService:AirInformationService) {}

    @Get("pollution")
    getPollution(geoInfo:AirPollutionGeoInfoDTO): Promise<AirPollutionResult> {
        return this.airInformationService.getNearestCityPopulation(geoInfo);
    }
}
