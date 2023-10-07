import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { AirInformationService } from './air-information-service';
import { AirInformationProviderEnum } from './types';


describe('ExternalIntegrationService', () => {

  let service: AirInformationService;
  


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({

      providers: [AirInformationService],
      imports:[ConfigModule.forRoot({
        envFilePath: '.env.test',
      })]

    }).compile();


    service = module.get<AirInformationService>(
      AirInformationService,
  
    );

  });


  it('should be defined', () => {

    expect(service).toBeDefined();

  });

  
  it("tests the integration with API of IQAIR and should return the pollution data",async ()=>{
    service.createProvider(AirInformationProviderEnum.IQAirProvider)
    const {Result:{pollution}}=await service.getNearestCityPopulation({lat:31.00192,lon:  30.78847})||{};
    expect(pollution).toBeDefined();
    expect(pollution).toHaveProperty("aqius");
    expect(pollution).toHaveProperty("aqicn");
    expect(pollution).toHaveProperty("mainus");
    expect(pollution).toHaveProperty("maincn");
    expect(pollution).toHaveProperty("ts");

  }
  )

});

