import { AirInformationProviderEnum } from '../utils/types';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';
import { IQAirProvider } from '../external-providers/iq-air-provider';

describe('AirInformationService', () => {
  beforeAll(async () => {});
  it('Returns IQAirProvider', () => {
    const airInformationProviderFactory = new AirInformationProviderFactory();
    const provider = airInformationProviderFactory.getStrategy(
      AirInformationProviderEnum.IQAirProvider,
    );
    expect(provider).toBeInstanceOf(IQAirProvider);
  });

  it('Throws error when invalid provider is provided', () => {
    const airInformationProviderFactory = new AirInformationProviderFactory();
    expect(() => {
      airInformationProviderFactory.getStrategy(
        AirInformationProviderEnum['test'],
      );
    }).toThrowError();
  });
});
