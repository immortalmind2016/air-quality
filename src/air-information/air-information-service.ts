import { Injectable, Logger } from '@nestjs/common';
import {
  AirInformationProvider,
  AirInformationProviderEnum,
  AirPollutionResult,
  PollutionInfo,
} from './types';
import { AirPollutionGeoInfoDTO } from './dto/air-information.dto';
import { IQAirProvider } from './external-providers/iq-air-provider';
import { InjectModel } from '@nestjs/mongoose';
import { Pollution } from './schema/pollution.schema';
import { Model } from 'mongoose';

@Injectable()
export class AirInformationService {
  private logger = new Logger(AirInformationService.name);
  private provider: AirInformationProvider;

  constructor(
    @InjectModel(Pollution.name) private pollutionModel: Model<Pollution>,
  ) {}

  //TODO: will make it private once we have a discriminator key in the input.
  createProviderFactory(providerName: AirInformationProviderEnum) {
    switch (providerName) {
      case AirInformationProviderEnum.IQAirProvider:
        const _IQAirProvider = new IQAirProvider();
        _IQAirProvider.setApiKey(process.env.IQ_AIR_API_KEY);
        return _IQAirProvider;
      default:
        throw new Error('Invalid provider name');
    }
  }

  private setProvider(provider: AirInformationProvider) {
    this.provider = provider;
  }

  async getNearestCityPopulation(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<AirPollutionResult> {
    this.logger.log(
      `get nearest city population for ${JSON.stringify(geoInfo)}`,
    );

    // Base on a discriminator, we can use different providers
    // to get the air pollution data
    const provider = this.createProviderFactory(
      AirInformationProviderEnum.IQAirProvider,
    );
    this.setProvider(provider);
    // Once we have multiple providers, we are using a factory to get the right provider based on the discriminator.

    // We are using strategy pattern here, so we can easily add more providers, And using the same interface .
    const pollution = await this.provider.getNearestCityPollution(geoInfo);
    return {
      Result: {
        pollution,
      },
    };
  }

  async storeGeoPollution(
    geoInfo: AirPollutionGeoInfoDTO,
    info: PollutionInfo,
  ) {
    this.logger.log(`store geo pollution for ${JSON.stringify(geoInfo)}`);
    return this.pollutionModel.create({ geoInfo: geoInfo, ...info });
  }

  async getMostPollutedDate(geoInfo: AirPollutionGeoInfoDTO) {
    this.logger.log(`get most polluted date for ${JSON.stringify(geoInfo)}`);
    console.log(
      await this.pollutionModel.findOne({ geoInfo }).sort({ aqius: -1 }),
    );
    // -1 for DESC order
    return (
      await this.pollutionModel
        .findOne({ 'geoInfo.lat': geoInfo.lat, 'geoInfo.lon': geoInfo.lon })
        .sort({ aqius: -1 })
        .lean()
    )?.createdAt;
  }
}
