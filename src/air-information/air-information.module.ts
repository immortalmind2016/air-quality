import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from './schema/pollution.schema';
import { AirInformationController } from './controller/air-information.controller';
import { BullModule } from '@nestjs/bull';
import { Queues } from './utils/types';
import { AirInfoQueueConsumer } from './queue/air-info-queue-consumer';
import { AirInformationProviderFactory } from './external-providers/air-info-provider-factory';
import { AirInformationInternalController } from './controller/air-information-internal.controller';

@Module({
  providers: [
    AirInformationService,
    AirInfoQueueConsumer,
    AirInformationProviderFactory,
  ],
  imports: [
    ConfigModule.forRoot({
      // Add the .env for production as well once we have this environment
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
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
      limiter: {
        max: 1,
        duration: 60 * 1000,
      },
    }),
  ],
  exports: [AirInformationService],
  controllers: [AirInformationController, AirInformationInternalController],
})
export class AirInformationModule {}
