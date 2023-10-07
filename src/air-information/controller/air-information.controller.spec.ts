import { Test, TestingModule } from '@nestjs/testing';
import { AirInformationController } from './air-information.controller';
import { AirInformationService } from '../air-information-service';
import { ConfigModule } from '@nestjs/config';

describe('AirInformationController', () => {
  let controller: AirInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirInformationController],
      imports:[ConfigModule.forRoot({
        envFilePath: '.env.test',
      })],
      providers:[AirInformationService]
    }).compile();

    controller = module.get<AirInformationController>(AirInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("Should return the pollution data",async ()=>{
    const response=await controller.getPollution({lat:31.00192,lon:  30.78847});
    expect(response).toBeDefined();
    expect(response?.Result?.pollution).toHaveProperty("aqius");
    expect(response?.Result?.pollution).toHaveProperty("aqicn");
    expect(response?.Result?.pollution).toHaveProperty("mainus");
    expect(response?.Result?.pollution).toHaveProperty("maincn");
    expect(response?.Result?.pollution).toHaveProperty("ts");


  })
});
