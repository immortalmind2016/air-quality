import { NestFactory } from '@nestjs/core';
import { AirInformationService } from '../air-information-service';
import { Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { AirInformationModule } from '../air-information.module';
import { Queue } from 'bull';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';

const GEO_INFO = {
  lat: 31.00192,
  lon: 30.78847,
};

const logger = new Logger('getAirInfo cron-job');
const addAirInfoJob = async (queue: Queue, geoInfo: AirPollutionGeoInfoDTO) => {
  return queue.add(geoInfo);
};

export const getAirInfo = async () => {
  logger.log('Running the cron job of getting air info');
  const app = await NestFactory.createApplicationContext(AirInformationModule); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const queue = await AirInfoService.getAirInfoQueue();
  logger.log('Adding air info job');
  await addAirInfoJob(queue, GEO_INFO);
};

// Every minute we will get the air info
cron.schedule('* * * * *', () => {
  getAirInfo();
});
