import { Injectable, Logger } from '@nestjs/common';
import { AirInformationProvider, AirInformationProviderEnum, PollutionData } from './types';
import {  AirPollutionGeoInfoDTO } from './dto/air-information.dto';
import { IQAirProvider } from './external-providers/iq-air-provider';


@Injectable()
export class AirInformationService {
  private logger = new Logger(AirInformationService.name);

  
  private provider: AirInformationProvider;

   createProvider (providerName: AirInformationProviderEnum) {
    switch (providerName) {
      case AirInformationProviderEnum.IQAirProvider:
        const _IQAirProvider=new IQAirProvider()
        _IQAirProvider.setApiKey(process.env.IQ_AIR_API_KEY);
        return _IQAirProvider
      default:
        throw new Error('Invalid provider name');
    }
  }

  setProvider(provider: AirInformationProvider) {
    this.provider = provider;
  }

  async getNearestCityPopulation(geoInfo:AirPollutionGeoInfoDTO): Promise<{Result:{pollution:PollutionData}}> {

    this.logger.log(`get nearest city population for ${JSON.stringify(geoInfo)}`)

    // Base on a discriminator, we can use different providers
    // to get the air pollution data
    let provider=this.createProvider(AirInformationProviderEnum.IQAirProvider);
    this.setProvider(provider);
    // Once we have multiple providers, we are using a factory to get the right provider based on the discriminator.

    // We are using strategy pattern here, so we can easily add more providers, And using the same interface .
    const pollution = await this.provider.getNearestCityPollution(geoInfo);
    return {
      Result:{
        pollution
      }
    }
  }
}
