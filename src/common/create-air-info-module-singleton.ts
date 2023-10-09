import { NestFactory } from '@nestjs/core';
import { AirInformationModule } from '../air-information/air-information.module';
import { INestApplicationContext } from '@nestjs/common';

export class CreateAirInformationModuleSingleton {
  private static instance: INestApplicationContext;

  public static async getInstance(): Promise<INestApplicationContext> {
    if (!CreateAirInformationModuleSingleton.instance) {
      CreateAirInformationModuleSingleton.instance =
        await NestFactory.createApplicationContext(AirInformationModule);
    }

    return CreateAirInformationModuleSingleton.instance;
  }
}
