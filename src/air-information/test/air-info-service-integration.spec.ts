/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  AirInformationProvider,
  AirInformationProviderEnum,
  GeoInformation,
  PollutionInfo,
  Queues,
} from '../types';
import {
  MongooseModule,
  getConnectionToken,
  getModelToken,
} from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import mongoose, { Connection, Model, connect } from 'mongoose';
import axios from 'axios';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { AirInfoQueueConsumer } from '../queue/air-info-queue';
import { AirInformationService } from '../air-information-service';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';
import IORedis from 'ioredis-mock'; // Import ioredis-mock
import { Queue } from 'bull';

describe('Air information service [Integration-test]', () => {
  let service: AirInformationService;

  let payload: PollutionInfo = null;
  let geoInfo: GeoInformation = null;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let pollutionModel: Model<Pollution>;
  let mockAxiosResponse;
  let redisClient;
  let module: TestingModule;

  beforeAll(async () => {
    mockAxiosResponse = {
      data: {
        data: {
          current: {
            pollution: {
              aqius: 18,
              aqicn: 20,
              mainus: 'p1',
              maincn: 'p1',
              ts: new Date('2017-02-01T01:15:00.000Z'),
            },
          },
        },
      },
    };
    jest.spyOn(axios, 'get').mockResolvedValue(mockAxiosResponse);
    redisClient = new IORedis();
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    pollutionModel = mongoConnection.model(Pollution.name, PollutionSchema);

    module = await Test.createTestingModule({
      providers: [
        AirInformationService,
        { provide: getModelToken(Pollution.name), useValue: pollutionModel },
        AirInfoQueueConsumer,
        AirInformationProviderFactory,
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
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();

    const queue = module.get<Queue>(getQueueToken(Queues.AirInformationQueue));
    await queue.close();

    const connection = module.get<mongoose.Connection>(getConnectionToken());
    await connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the nearest city pollution API of IQAIR[mocked] and should return the pollution data', async () => {
    const {
      Result: { pollution },
    } =
      (await service.getNearestCityPollution({
        lat: 31.00192,
        lon: 30.78847,
      })) || {};
    expect(pollution).toBeDefined();
    expect(pollution).toHaveProperty('aqius');
    expect(pollution).toHaveProperty('aqicn');
    expect(pollution).toHaveProperty('mainus');
    expect(pollution).toHaveProperty('maincn');
    expect(pollution).toHaveProperty('ts');
  });

  it('stores data in pollution collection', async () => {
    await service.storeGeoPollution(geoInfo, payload);
    const data = await pollutionModel.findOne({ geoInfo }).lean();
    expect(data).toBeDefined();
    expect(data).toHaveProperty('_id');
    expect(data).toHaveProperty('createdAt');
    expect(data?.aqius).toBe(payload.aqius);
    expect(data?.geoInfo).toEqual(geoInfo);
    expect(data._id).toBeDefined();
  });

  it('stores data in pollution collection', async () => {
    await service.storeGeoPollution(geoInfo, payload);
    const date = await service.getMostPollutedDate(geoInfo);
    expect(date).toBeDefined();
  });
});
