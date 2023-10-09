// strategy.factory.ts
import { Injectable } from '@nestjs/common';
import { AirInformationProvider, AirInformationProviderEnum } from '../types';
import { IQAirProvider } from './iq-air-provider';

@Injectable()
export class AirInformationProviderFactory {
  private strategies: Record<
    AirInformationProviderEnum.IQAirProvider,
    () => AirInformationProvider
  > = {
    [AirInformationProviderEnum.IQAirProvider]: () => {
      const _IQAirProvider = new IQAirProvider();
      _IQAirProvider.setApiKey(process.env.IQ_AIR_API_KEY);
      return _IQAirProvider;
    },
  };

  getStrategy(
    strategyName: AirInformationProviderEnum,
  ): AirInformationProvider {
    const strategy = this.strategies[strategyName]?.();

    if (!strategy) {
      throw new Error(`Strategy '${strategyName}' not found.`);
    }
    return strategy;
  }
}
