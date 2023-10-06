export interface PollutionData {
  [keyof: string]: string | number;
}
export interface GeoInformation {
  lat:number;
  lon:number;
}
export interface  AirInformationProvider{
  getNearestCityPollution(): Promise<PollutionData>;
}