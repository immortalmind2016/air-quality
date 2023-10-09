import { Test, TestingModule } from '@nestjs/testing';
import {} from '../controller/air-information.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from '../schema/pollution.schema';
import { AirInformationService } from '../air-information-service';
import { AirInformationInternalController } from '../controller/air-information-internal.controller';
import { BullModule } from '@nestjs/bull';
import { Queues } from '../types';
import { AirInfoQueueConsumer } from '../queue/air-info-queue';
import { AirInformationProviderFactory } from '../external-providers/air-info-provider-factory';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
