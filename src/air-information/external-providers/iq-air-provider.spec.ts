import { IQAirProvider } from './iq-air-provider';
import axios from 'axios';

jest.mock('axios');

describe('IQAirProvider', () => {
  let iqAirProvider: IQAirProvider;

  beforeEach(() => {
    iqAirProvider = new IQAirProvider();
  });

  it('should get nearest city pollution', async () => {
    // Mock Axios.get method
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: {
          current: {
            pollution: {
              aqius: 18,
              aqicn: 20,
              mainus: 'p1',
              maincn: 'p1',
              ts: '2017-02-01T01:15:00.000Z',
            },
          },
        },
      },
    });

    // Set the API key
    iqAirProvider.setApiKey('your-api-key');

    // Call the function to get pollution data
    const geoInfo = { lat: 31.00192, lon: 30.78847 };
    const pollutionData = await iqAirProvider.getNearestCityPollution(geoInfo);

    // Assertions
    expect(pollutionData).toBeDefined();
    expect(pollutionData.aqius).toBe(18);
    expect(pollutionData.aqicn).toBe(20);
    expect(pollutionData.mainus).toBe('p1');
    expect(pollutionData.maincn).toBe('p1');
    expect(pollutionData.ts).toBe('2017-02-01T01:15:00.000Z');

    // Verify Axios.get was called with the expected URL and parameters
    expect(axios.get).toHaveBeenCalledWith(`${process.env.IQ_AIR_ENDPOINT}/nearest_city`, {
      params: {
        lat: geoInfo.lat,
        lon: geoInfo.lon,
        key: 'your-api-key',
      },
    });
  });

  it('should throw an error if geoInfo is not set', async () => {
    // Call the function without setting geoInfo
    await expect(iqAirProvider.getNearestCityPollution(null)).rejects.toThrow(
      'GeoInformation is not set',
    );
  });

  // Add more test cases for error handling, etc.
});
