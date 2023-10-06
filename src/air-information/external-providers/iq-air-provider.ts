import { AirPollutionGeoInfoDTO } from "../dto/air-information.dto";
import { AirInformationProvider, GeoInformation, PollutionData } from "../types";
import axios from 'axios';

export class  IQAirProvider implements AirInformationProvider{

    private apiKey:string;
    private GeoInformation:GeoInformation;

    setGeoInformation(GeoInformation:GeoInformation){
        this.GeoInformation = GeoInformation;
    }
    setApiKey(apiKey:string){
      this.apiKey=apiKey;
    }

    async getNearestCityPollution(geoInfo:AirPollutionGeoInfoDTO):Promise<PollutionData>{

      if(!geoInfo){
        throw new Error("GeoInformation is not set");
      }
      if(!this.apiKey){
        throw new Error("Api key is not set");
      }
      try{
        const response=await axios.get(`${process.env.IQ_AIR_ENDPOINT}/nearest_city`,{params:{
          lat:geoInfo.lat,
          lon:geoInfo.lon,
          key:this.apiKey
        }}
        );
        return response.data?.data?.current?.pollution
      }catch(e){
      }
      
      return null
    }
  }
