import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from './schema/pollution.schema';
import { AirInformationInternalController } from './controller/air-information.internal.controller';
import { AirInformationController } from './controller/air-information.controller';


@Module({

  providers: [AirInformationService],
  imports:[ConfigModule.forRoot(
    {
      // Add the .env for production as well once we have this environment
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
    }
  ),
  MongooseModule.forFeature([{name:Pollution.name,schema:PollutionSchema}]),
  MongooseModule.forRootAsync({
    inject:[ConfigService],
    imports:[ConfigModule],
    useFactory:(configService:ConfigService)=>{
      return {
        uri:configService.get("MONGO_URI")
      }
    },
    
  })
],
  exports:[AirInformationService],
  controllers: [AirInformationController, AirInformationInternalController]

})

export class AirInformationModule {}

