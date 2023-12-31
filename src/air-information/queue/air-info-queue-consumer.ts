import {
  Processor,
  Process,
  InjectQueue,
  OnQueueActive,
  OnQueueError,
  OnQueuePaused,
  OnQueueResumed,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { GeoInformation, Queues } from '../utils/types';
import { AirInformationService } from '../air-information-service';
import { Logger } from '@nestjs/common';

@Processor(Queues.AirInformationQueue)
export class AirInfoQueueConsumer {
  private readonly logger = new Logger(AirInfoQueueConsumer.name);
  private timer: NodeJS.Timeout;
  constructor(
    private readonly AirInfoService: AirInformationService,
    @InjectQueue(Queues.AirInformationQueue)
    private readonly airInfoQueue: Queue,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process()
  async getAirInfo(job: Job<GeoInformation>) {
    this.logger.log('Consuming air info queue');

    try {
      const response = await this.AirInfoService.getNearestCityPollution(
        job.data,
      );
      const pollution = response.Result.pollution;
      this.logger.log('store air info');

      await this.AirInfoService.storeGeoPollution(job.data, pollution);
    } catch (e) {
      // If the provider is not available, we will pause the queue
      // and we will check the status of the provider every 30 minutes [Read our docs].

      await Promise.all([
        this.airInfoQueue.pause(),
        job.moveToFailed({ message: e.message }, true),
      ]);
      this.logger.warn('The air info provider is not available, queue paused');
    }
  }

  @OnQueueError()
  onError(error) {
    this.logger.error(error);
  }

  @OnQueuePaused()
  async onPause() {
    this.logger.warn('Queue paused');
  }

  @OnQueueResumed()
  onResume() {
    this.logger.warn('Queue resumed');
    clearInterval(this.timer);
  }
}
