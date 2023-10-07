import { Test, TestingModule } from '@nestjs/testing';
import { AirInformationInternalController } from './air-information.internal.controller';

describe('AirInformationInternalController', () => {
  let controller: AirInformationInternalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirInformationInternalController],
    }).compile();

    controller = module.get<AirInformationInternalController>(AirInformationInternalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
