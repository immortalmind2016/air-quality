import { NestFactory } from '@nestjs/core';
import { AirInformationService } from '../air-information-service';
import { Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { AirInformationModule } from '../air-information.module';

const logger = new Logger('checkAirInfoProviderStatus cron-job');
const GEO_INFO = {
  lat: 31.00192,
  lon: 30.78847,
};

// We can use this function to check the status of the air info provider
// If the provider is available, we will resume the queue

export const checkAirInfoProviderStatus = async () => {
  logger.log('Running the cron job of checking the air info provider status');
  const app = await NestFactory.createApplicationContext(AirInformationModule); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const queue = await AirInfoService.getAirInfoQueue();
  if (queue.isPaused()) {
    logger.log('Queue is paused');
    try {
      await AirInfoService.getNearestCityPollution(GEO_INFO);
      queue.resume();
      logger.error('Queue is resumed');
    } catch (e) {
      if (e) {
        logger.error('The air info provider is not available to our requests');
      }
    }
  } else {
    logger.error('is not paused');
  }
};

// Every 2 minutes we will check the status of the air info provider
cron.schedule('*/2 * * * *', () => {
  checkAirInfoProviderStatus();
});
