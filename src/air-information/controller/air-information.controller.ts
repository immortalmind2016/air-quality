import { BadRequestException, Body, Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AirInformationService } from '../air-information-service';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirPollutionResult, GeoInformation } from '../types';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('air-information')
export class AirInformationController {
    private readonly logger=new Logger(AirInformationController.name)
    constructor(private readonly airInformationService:AirInformationService) {}


     
    @Get('pollution')
    @ApiOperation({ summary: 'Get pollution data by coordinates' })
    @ApiQuery({ name: 'lat', type: Number, description: 'Latitude' })
    @ApiQuery({ name: 'lon', type: Number, description: 'Longitude' })
    @ApiResponse({
        status: 200,
        description: 'Successful response',
        type: Promise<AirPollutionResult>,
    })
    async getPollution(@Query("lat") lat:number, @Query("lon") lon:number): Promise<AirPollutionResult> {
        let geoInfo:GeoInformation={
            lat,
            lon
        }
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
