import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AirInformationService } from '../air-information-service';
import * as cron from 'node-cron';
import { Logger } from '@nestjs/common';

const GEO_INFO = {
  lat: 31.00192,
  lon: 30.78847,
};

const logger = new Logger('getAirInfo cron-job');

const getAirInfo = async () => {
  logger.log('Running the cron job of getting air info');
  const app = await NestFactory.createApplicationContext(AppModule); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const response = await AirInfoService.getNearestCityPopulation(GEO_INFO);
  const pollution = response.Result.pollution;
  logger.log('Storing air info');
  await AirInfoService.storeGeoPollution(GEO_INFO, pollution);
};

cron.schedule('* * * * *', () => {
  getAirInfo();
});
