import { Test, TestingModule } from '@nestjs/testing';
import { KiltAuthService } from './kilt-auth.service';

describe('KiltAuthService', () => {
  let service: KiltAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KiltAuthService],
    }).compile();

    service = module.get<KiltAuthService>(KiltAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
