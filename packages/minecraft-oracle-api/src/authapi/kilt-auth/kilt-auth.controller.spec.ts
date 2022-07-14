import { Test, TestingModule } from '@nestjs/testing';
import { KiltAuthController } from './kilt-auth.controller';

describe('KiltAuthController', () => {
  let controller: KiltAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KiltAuthController],
    }).compile();

    controller = module.get<KiltAuthController>(KiltAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
