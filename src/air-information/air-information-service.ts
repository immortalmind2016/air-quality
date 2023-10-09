import { Injectable, Logger } from '@nestjs/common';
import {
  AirInformationProviderEnum,
  AirPollutionResult,
  PollutionInfo,
  Queues,
} from './types';
import { AirPollutionGeoInfoDTO } from './dto/air-information.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pollution } from './schema/pollution.schema';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { AirInformationProviderFactory } from './external-providers/air-info-provider-factory';
import { DatabaseException } from '../common/exceptions/database-exception';

@Injectable()
export class AirInformationService {
  private logger = new Logger(AirInformationService.name);

  constructor(
    @InjectModel(Pollution.name) private pollutionModel: Model<Pollution>,
    @InjectQueue(Queues.AirInformationQueue) private airInfoQueue: Queue,
    private readonly airInformationProviderFactory: AirInformationProviderFactory,
  ) {}

  async getNearestCityPollution(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<AirPollutionResult> {
    this.logger.log(
      `get nearest city pollution for ${JSON.stringify(geoInfo)}`,
    );

    // Base on a discriminator, we can use different providers
    // to get the air pollution data
    // Currently, we will hard code the provider.
    const provider = this.airInformationProviderFactory.getStrategy(
      AirInformationProviderEnum.IQAirProvider,
    );
    // Once we have multiple providers, we are using a factory to get the right provider based on the discriminator.

    // We are using strategy pattern here, so we can easily add more providers, And using the same interface .
    try {
      const pollution = await provider.getNearestCityPollution(geoInfo);
      return {
        Result: {
          pollution,
        },
      };
    } catch (e) {
      this.logger.warn(e.message);
      throw new DatabaseException(e.message);
    }
  }

  async storeGeoPollution(
    geoInfo: AirPollutionGeoInfoDTO,
    info: PollutionInfo,
  ) {
    this.logger.log(`store geo pollution for ${JSON.stringify(geoInfo)}`);
    try {
      const createdInfo = await this.pollutionModel.create({
        geoInfo: geoInfo,
        ...info,
      });
      return createdInfo;
    } catch (e) {
      this.logger.warn(e.message);
      throw new DatabaseException(e.message);
    }
  }

  async getMostPollutedDate(geoInfo: AirPollutionGeoInfoDTO) {
    this.logger.log(`get most polluted date for ${JSON.stringify(geoInfo)}`);
    // -1 for DESC order
    try {
      return (
        await this.pollutionModel
          .findOne({ 'geoInfo.lat': geoInfo.lat, 'geoInfo.lon': geoInfo.lon })
          .sort({ aqius: -1 })
          .lean()
      )?.createdAt;
    } catch (e) {
      this.logger.warn(e.message);
      throw new DatabaseException(e.message);
    }
  }

  //TODO: We can have a separate service for the queue
  async getAirInfoQueue() {
    return this.airInfoQueue;
  }
}
