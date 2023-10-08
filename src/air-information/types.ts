import { AirPollutionGeoInfoDTO } from './dto/air-information.dto';

export interface AirPollutionResult {
  Result: {
    pollution: PollutionInfo;
  };
}
export interface GeoInformation {
  lat: number;
  lon: number;
}
export interface AirInformationProvider {
  getNearestCityPollution(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<PollutionInfo>;
}

export enum AirInformationProviderEnum {
  IQAirProvider = 'IQAirProvider',
}

export interface PollutionInfo {
  ts: Date;
  aqius: number; //main pollutant for US AQI
  mainus: string;
  aqicn: number; //main pollutant for Chinese AQI
  maincn: string;
}
