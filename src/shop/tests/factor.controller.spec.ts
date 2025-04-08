import { Test, TestingModule } from '@nestjs/testing';
import { FactorController } from '../controllers/factor.controller';

describe('FactorController', () => {
  let controller: FactorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactorController],
    }).compile();

    controller = module.get<FactorController>(FactorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
