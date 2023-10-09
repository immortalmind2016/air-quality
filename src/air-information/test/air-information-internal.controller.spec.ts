import { Test, TestingModule } from '@nestjs/testing';
import {} from '../controller/air-information.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import { AirInformationService } from '../air-information-service';
import { AirInformationInternalController } from '../controller/air-information-internal.controller';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queues } from '../types';
import { AirInfoQueueConsumer } from '../queue/air-info-queue';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';
import mongoose, { Connection, connect } from 'mongoose';
import { Queue } from 'bull';
import IORedis from 'ioredis-mock';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AirInformationInternalController', () => {
  let controller: AirInformationInternalController;
  let module: TestingModule;
  let redisClient;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    redisClient = new IORedis();
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    module = await Test.createTestingModule({
      controllers: [AirInformationInternalController],
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
      providers: [
        AirInformationService,
        AirInfoQueueConsumer,
        AirInformationProviderFactory,
      ],
    }).compile();

    controller = module.get<AirInformationInternalController>(
      AirInformationInternalController,
    );
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
    expect(controller).toBeDefined();
  });
});
