import { Test, TestingModule } from '@nestjs/testing';
import { AirInformationController } from './air-information.controller';
import { AirInformationService } from '../air-information-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';

describe('AirInformationController', () => {
  let controller: AirInformationController;
  
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirInformationController],
      imports:[ConfigModule.forRoot({
        envFilePath: '.env.test',
      }),MongooseModule.forFeature([{name:Pollution.name,schema:PollutionSchema}]),
      MongooseModule.forRootAsync({
        inject:[ConfigService],
        imports:[ConfigModule],
        useFactory:(configService:ConfigService)=>{
          return {
            uri:configService.get("MONGO_URI")
          }
        },
        
      })],
      providers:[AirInformationService]
    }).compile();

    controller = module.get<AirInformationController>(AirInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("Should return the pollution data",async ()=>{
    const response=await controller.getPollution(31.00192,30.78847);
    expect(response).toBeDefined();
    expect(response?.Result?.pollution).toHaveProperty("aqius");
    expect(response?.Result?.pollution).toHaveProperty("aqicn");
    expect(response?.Result?.pollution).toHaveProperty("mainus");
    expect(response?.Result?.pollution).toHaveProperty("maincn");
    expect(response?.Result?.pollution).toHaveProperty("ts");


  })
});
