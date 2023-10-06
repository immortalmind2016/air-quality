import { Injectable } from '@nestjs/common';
import { AirInformationProvider, PollutionData } from './types';


@Injectable()
export class AirInformationService {
  private provider: AirInformationProvider;

  setProvider(provider: AirInformationProvider) {
    this.provider = provider;
  }

  async getNearestCityPopulation(): Promise<{Result:{pollution:PollutionData}}> {
    const pollution = await this.provider.getNearestCityPollution();
    return {
      Result:{
        pollution
      }
    }
  }
}
