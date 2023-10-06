import { Test, TestingModule } from '@nestjs/testing';
import { AirInformationController } from './air-information.controller';

describe('AirInformationController', () => {
  let controller: AirInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirInformationController],
    }).compile();

    controller = module.get<AirInformationController>(AirInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
