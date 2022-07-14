import { Test, TestingModule } from '@nestjs/testing';
import { KiltSessionService } from './kilt-session.service';

describe('KiltSessionService', () => {
  let service: KiltSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KiltSessionService],
    }).compile();

    service = module.get<KiltSessionService>(KiltSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
