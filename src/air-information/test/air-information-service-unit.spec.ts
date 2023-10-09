/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AirInformationService } from '../air-information-service';
import {
  AirInformationProvider,
  AirInformationProviderEnum,
  GeoInformation,
  PollutionInfo,
  Queues,
} from '../types';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import mongoose, { Connection, Model, connect } from 'mongoose';
import axios from 'axios';
import { BullModule } from '@nestjs/bull';
import { AirInfoQueueConsumer } from '../queue/air-info-queue';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';

class MockProviderFactory implements AirInformationProvider {
  getNearestCityPollution(
    geoInfo: AirPollutionGeoInfoDTO,
  ): Promise<PollutionInfo> {
    throw new Error('Method not implemented.');
  }
  getStrategy(strategyName: string): AirInformationProvider {
    // Implement the mock behavior here based on the strategyName

    return {
      getNearestCityPollution: jest.fn(async () => {
        // Implement your mock behavior for getNearestCityPollution here
        return {
          aqius: 18,
          aqicn: 20,
          mainus: 'p1',
          maincn: 'p1',
          ts: new Date('2017-02-01T01:15:00.000Z'),
        }; // Replace with your mock data or behavior
      }),
    };
  }
}
describe('Air information service [unit-tests]', () => {
  let service: AirInformationService;

  let payload: PollutionInfo = null;
  let geoInfo: GeoInformation = null;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let pollutionModel: Model<Pollution>;

  beforeAll(async () => {
    // jest.spyOn(axios, 'get').mockResolvedValue(mockAxiosResponse);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirInformationService,
        AirInfoQueueConsumer,
        {
          provide: AirInformationProviderFactory,
          useClass: MockProviderFactory,
        },
      ],
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
        BullModule.forRootAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              redis: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
              },
            };
          },
        }),
        BullModule.registerQueue({
          name: Queues.AirInformationQueue,
        }),
      ],
    }).compile();

    pollutionModel = module.get(getModelToken(Pollution.name));

    service = module.get<AirInformationService>(AirInformationService);
  });
  beforeEach(async () => {
    payload = {
      aqius: 18,
      aqicn: 20,
      mainus: 'p1',
      maincn: 'p1',
      ts: new Date('2017-02-01T01:15:00.000Z'),
    };

    geoInfo = { lat: 31.00192, lon: 30.78847 };
  });

  afterAll(async () => {});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('tests the getNearestCityPopulation function with mocked provider strategy ', async () => {
    const {
      Result: { pollution },
    } = (await service.getNearestCityPopulation(geoInfo)) || {};

    expect(pollution).toHaveProperty('aqius');
    expect(pollution).toHaveProperty('aqicn');
    expect(pollution).toHaveProperty('mainus');
    expect(pollution).toHaveProperty('maincn');
    expect(pollution).toHaveProperty('ts');
  });

  it("stores the pollution data in the database and returns it's id with mocked db method", async () => {
    const _id = new mongoose.Types.ObjectId();
    jest.spyOn(pollutionModel, 'create').mockResolvedValue({
      _id,
      ...payload,
      geoInfo,
    } as any);

    const pollution = await service.storeGeoPollution(geoInfo, payload);

    expect(pollution._id).toBe(_id);
    expect(pollution).toBeDefined();
  });
  it('retrieve the most polluted date from the database with mocked db method', async () => {
    const _id = new mongoose.Types.ObjectId();
    jest.spyOn(pollutionModel, 'findOne').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...payload,
          geoInfo,
          createdAt: new Date('2017-02-01T01:15:00.000Z'),
        }),
      }),
    } as any);

    jest.spyOn(pollutionModel, 'create').mockResolvedValue({
      _id,
      ...payload,
      geoInfo,
    } as any);

    await service.storeGeoPollution(geoInfo, payload);

    const mostPollutedDate = await service.getMostPollutedDate(geoInfo);

    expect(mostPollutedDate).toBeDefined();
    expect(mostPollutedDate).toBeInstanceOf(Date);
  });

  it('ensures that getAirInfoQueue is defined', async () => {
    const queue = await service.getAirInfoQueue();
    expect(queue).toBeDefined();
  });
});
