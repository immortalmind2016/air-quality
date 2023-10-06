import { AirPollutionGeoInfoDTO } from "./dto/air-information.dto";

export interface PollutionData {
  [keyof: string]: string | number;
}
export interface GeoInformation {
  lat:number;
  lon:number;
}
export interface  AirInformationProvider{
  getNearestCityPollution(geoInfo:AirPollutionGeoInfoDTO): Promise<PollutionData>;
}

export enum AirInformationProviderEnum{
  IQAirProvider = "IQAirProvider",
}