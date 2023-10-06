import { IsLatitude, IsLongitude } from "class-validator";

export class AirPollutionGeoInfoDTO{

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}