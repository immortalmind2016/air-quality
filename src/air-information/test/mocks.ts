/* eslint-disable @typescript-eslint/no-unused-vars */
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirInformationProvider, PollutionInfo } from '../utils/types';

export class MockProviderFactory implements AirInformationProvider {
  getNearestCityPollution(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<PollutionInfo> {
    throw new Error('Method not implemented.');
  }
  getStrategy(strategyName: string): AirInformationProvider {
    // Implement the mock behavior here based on the strategyName

    return {
      getNearestCityPollution: jest.fn(async () => {
        // Implement your mock behavior for getNearestCityPollution here
        return {
          aqius: 18,
          aqicn: 20,
          mainus: 'p1',
          maincn: 'p1',
          ts: new Date('2017-02-01T01:15:00.000Z'),
        }; // Replace with your mock data or behavior
      }),
    };
  }
}
