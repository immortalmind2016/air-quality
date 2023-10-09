import { AirInformationService } from '../air-information-service';
import { Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { Queue } from 'bull';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { CreateAirInformationModuleSingleton } from '../../common/create-air-info-module-singleton';

const GEO_INFO = {
  lat: 31.00192,
  lon: 30.78847,
};

const logger = new Logger('getAirInfo cron-job');
const addAirInfoJob = async (queue: Queue, geoInfo: AirPollutionGeoInfoDTO) => {
  // 1 minute delay between each job
  return queue.add(geoInfo, { delay: 60 * 1000 });
};
const resetQueueStatus = async () => {
  logger.log('Resetting the queue status');
  const app = await CreateAirInformationModuleSingleton.getInstance(); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const queue = await AirInfoService.getAirInfoQueue();
  await queue.resume();
};
export const getAirInfo = async () => {
  logger.log('Running the cron job of getting air info');
  const app = await CreateAirInformationModuleSingleton.getInstance(); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const queue = await AirInfoService.getAirInfoQueue();
  logger.log('Adding air info job');
  await addAirInfoJob(queue, GEO_INFO);
};

resetQueueStatus();

// Every minute we will get the air info
cron.schedule('* * * * *', () => {
  getAirInfo();
});
