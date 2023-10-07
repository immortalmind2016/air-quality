import { BadRequestException, Body, Controller, Get, Logger } from '@nestjs/common';
import { AirInformationService } from '../air-information-service';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirPollutionResult } from '../types';

@Controller('air-information')
export class AirInformationController {
    private readonly logger=new Logger(AirInformationController.name)
    constructor(private readonly airInformationService:AirInformationService) {}

    @Get("pollution")
    async getPollution(@Body("geoInfo") geoInfo:AirPollutionGeoInfoDTO): Promise<AirPollutionResult> {
        // Handling the error here as well as the service function to return a proper response to the client based on the protocol.
        // So if we are using grpc, we can return a grpc error from it's interface.
        try{
            return this.airInformationService.getNearestCityPopulation(geoInfo);
           
        }catch(e){

            this.logger.warn(e.message)
            throw new Error(e.message);
        }
    }
}
