import { Module } from '@nestjs/common';

import { AirInformationService } from './air-information-service';
import { AirInformationController } from './air-information.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pollution, PollutionSchema } from './schema/pollution.schema';


@Module({

  providers: [AirInformationService],
  imports:[ConfigModule.forRoot(
    {
      // Add the .env for production as well once we have this environment
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
    }
  ),
  MongooseModule.forRootAsync({
    inject:[ConfigService],
    imports:[ConfigModule,MongooseModule.forFeature([{name:Pollution.name,schema:PollutionSchema}])],
    useFactory:(configService:ConfigService)=>{
      return {
        uri:configService.get("MONGO_URI")
      }
    },
    
  })
],
  exports:[AirInformationService],
  controllers: [AirInformationController]

})

export class AirInformationModule {}

