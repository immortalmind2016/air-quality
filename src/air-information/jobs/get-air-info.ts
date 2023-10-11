import { AirInformationService } from '../air-information-service';
import { Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { Queue } from 'bull';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { CreateAirInformationModuleSingleton } from '../../common/create-air-info-module-singleton';
import { GEO_INFO } from '../utils/constants';
import * as dayjs from 'dayjs';

const logger = new Logger('getAirInfo cron-job');
const addAirInfoJob = async (queue: Queue, geoInfo: AirPollutionGeoInfoDTO) => {
  // 1 minute delay between each job
  return queue.add(geoInfo, { delay: 60 * 1000 });
};

export const isShouldResumeQueue = async (queue: Queue) => {
  // We have to handle the graceful shutdown of the pod and the cronjob.
  // Case: 1
  // In the case of paused queues, the queue will not process any new jobs until resumed,
  // So kubernetes will close the pod and start a new one, but the new one will not process any jobs
  // As the queue is paused, so we need to resume it.
  // So we have here a threshold of 30 minutes

  // Case: 2
  // The same for the cronjob that started after graceful shutdown in the previous cronjob.

  // What we will do here is:
  // Check if there are any failed jobs that are newer than 30 minutes, if not
  // So we can resume the queue as the external provider may be available now.

  const beforeThreshold = dayjs().subtract(30, 'minute');
  const failedJobs = await queue.getFailed(0, 1);

  const failed = failedJobs?.[failedJobs.length - 1];

  // if no failed job in the last 3o minutes and the queue is paused return true.
  // if there is a failed job in the last 30 minutes and the queue is paused return true.

  const isFailedBeforeThreshold = failed
    ? dayjs(failed?.finishedOn).isBefore(beforeThreshold)
    : true;

  return isFailedBeforeThreshold && (await queue.isPaused());
};

export const getAirInfo = async () => {
  logger.log('Running the cron job of getting air info');
  const app = await CreateAirInformationModuleSingleton.getInstance(); // Pass your AppModule here
  const AirInfoService = app.get(AirInformationService);
  const queue = await AirInfoService.getAirInfoQueue();

  const shouldResumeQueue = await isShouldResumeQueue(queue);
  if (shouldResumeQueue) {
    logger.log('Resuming queue');
    await queue.resume();
  }
  logger.log('Adding air info job');
  await addAirInfoJob(queue, GEO_INFO);
};

// Every minute we will get the air info
cron.schedule('* * * * *', () => {
  getAirInfo();
});
