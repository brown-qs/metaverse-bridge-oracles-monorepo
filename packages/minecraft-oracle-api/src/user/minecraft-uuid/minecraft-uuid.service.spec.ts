import { Test, TestingModule } from '@nestjs/testing';
import { MinecraftUuidService } from './minecraft-uuid.service';

describe('MinecraftUuidService', () => {
  let service: MinecraftUuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinecraftUuidService],
    }).compile();

    service = module.get<MinecraftUuidService>(MinecraftUuidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
