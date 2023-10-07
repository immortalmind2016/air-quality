import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AirInformationService } from "../air-information-service";



const GEO_INFO={
lat:48.856613,
lon:2.352222
}

const getAirInfo=async ()=>{
    const app = await NestFactory.createApplicationContext(AppModule); // Pass your AppModule here
    const AirInfoService=app.get(AirInformationService)
    const response= await AirInfoService.getNearestCityPopulation(GEO_INFO);
    const pollution=response.Result.pollution
    await AirInfoService.storeGeoPollution(GEO_INFO,pollution)
}

