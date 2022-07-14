import { Test, TestingModule } from '@nestjs/testing';
import { KiltDappService } from './kilt-dapp.service';

describe('KiltDappService', () => {
  let service: KiltDappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KiltDappService],
    }).compile();

    service = module.get<KiltDappService>(KiltDappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
