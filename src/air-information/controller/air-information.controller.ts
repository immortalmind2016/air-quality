import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AirInformationService } from '../air-information-service';
import { AirPollutionResult } from '../utils/types';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';

@Controller('air-information')
export class AirInformationController {
  private readonly logger = new Logger(AirInformationController.name);
  constructor(private readonly airInformationService: AirInformationService) {}

  @Get('pollution')
  @ApiOperation({ summary: 'Get pollution data by coordinates' })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lon', type: Number, description: 'Longitude' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Promise<AirPollutionResult>,
  })
  async getPollution(
    @Query() geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<AirPollutionResult> {
    // Handling the error here as well as the service function to return a proper response to the client based on the protocol.
    // So if we are using grpc, we can return a grpc error from it's interface.
    try {
      return this.airInformationService.getNearestCityPollution(geoInfo);
    } catch (e) {
      this.logger.warn(e.message);
      throw new Error(e.message);
    }
  }

  @Get('most-polluted-date')
  @ApiOperation({ summary: 'Get the most polluted date' })
  @ApiQuery({
    name: 'lat',
    type: Number,
    required: false,
    description: 'Latitude',
  })
  @ApiQuery({
    name: 'lon',
    type: Number,
    required: false,
    description: 'Longitude',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Promise<Date>,
  })
  async getMostPollutedDate(
    @Query() geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<Date> {
    try {
      return this.airInformationService.getMostPollutedDate(geoInfo);
    } catch (e) {
      this.logger.warn(e.message);
      throw new Error(e.message);
    }
  }
}
