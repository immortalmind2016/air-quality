/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AirInformationService } from '../air-information-service';
import { GeoInformation, PollutionInfo, Queues } from '../utils/types';
import {
  MongooseModule,
  getConnectionToken,
  getModelToken,
} from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import mongoose, { Connection, Model, connect } from 'mongoose';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { AirInfoQueueConsumer } from '../queue/air-info-queue-consumer';
import { AirPollutionGeoInfoDTO } from '../dto/air-information.dto';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';
import { Queue } from 'bull';
import IORedis from 'ioredis-mock';
import { MockProviderFactory } from './mocks';

describe('Air information service [unit-tests]', () => {
  let service: AirInformationService;

  let payload: PollutionInfo = null;
  let geoInfo: GeoInformation = null;
  let pollutionModel: Model<Pollution>;
  let redisClient;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let module: TestingModule;
  let uri: string;

  beforeAll(async () => {
    redisClient = globalThis.__REDIS_CLIENT__;
    uri = globalThis.__MONGOD_URI__;
    mongoConnection = globalThis.__MONGOD_CONNECTION__;

    module = await Test.createTestingModule({
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
        MongooseModule.forRoot(uri),
        BullModule.forRoot({ redis: redisClient }),
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

  afterAll(async () => {
    const queue = module.get<Queue>(getQueueToken(Queues.AirInformationQueue));
    await queue.close();

    const connection = module.get<mongoose.Connection>(getConnectionToken());
    await connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('tests the getNearestCityPollution function with mocked provider strategy ', async () => {
    const {
      Result: { pollution },
    } = (await service.getNearestCityPollution(geoInfo)) || {};

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
