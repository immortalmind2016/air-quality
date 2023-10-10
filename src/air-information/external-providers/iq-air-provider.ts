import { ApiException } from '../../common/exceptions/api-key-exception';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirInformationProvider, PollutionInfo } from '../utils/types';
import axios from 'axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { ExternalCallException } from '../../common/exceptions/external-call-exception';

export class IQAirProvider implements AirInformationProvider {
  private readonly logger = new Logger(IQAirProvider.name);
  private apiKey: string;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getNearestCityPollution(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<PollutionInfo> {
    if (!geoInfo) {
      this.logger.warn('GeoInformation is not set');
      throw new BadRequestException('GeoInformation is not set');
    }
    if (!this.apiKey) {
      this.logger.warn('Api key is not set');
      throw new ApiException('Api key is not set');
    }

    try {
      this.logger.log('Getting nearest city pollution', {
        params: {
          lat: geoInfo.lat,
          lon: geoInfo.lon,
          key: this.apiKey,
        },
      });
      const response = await axios.get(
        `${process.env.IQ_AIR_ENDPOINT}/nearest_city`,
        {
          params: {
            lat: geoInfo.lat,
            lon: geoInfo.lon,
            key: this.apiKey,
          },
        },
      );
      return response.data?.data?.current?.pollution;
    } catch (e) {
      this.logger.warn(e.message);
      throw new ExternalCallException(
        'something went wrong while you are requesting an external APIs',
      );
    }
  }
}
