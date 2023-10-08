import { Test, TestingModule } from '@nestjs/testing';
import { AirInformationInternalController } from './air-information.internal.controller';
import {} from './air-information.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import { AirInformationService } from '../air-information-service';

describe('AirInformationInternalController', () => {
  let controller: AirInformationInternalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirInformationInternalController],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongooseModule.forFeature([
          { name: Pollution.name, schema: PollutionSchema },
        ]),
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              uri: configService.get('MONGO_URI'),
            };
          },
        }),
      ],
      providers: [AirInformationService],
    }).compile();

    controller = module.get<AirInformationInternalController>(
      AirInformationInternalController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
