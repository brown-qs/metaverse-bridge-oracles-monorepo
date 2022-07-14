import { Test, TestingModule } from '@nestjs/testing';
import { MinecraftLinkService } from './minecraft-link.service';

describe('MinecraftLinkService', () => {
  let service: MinecraftLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinecraftLinkService],
    }).compile();

    service = module.get<MinecraftLinkService>(MinecraftLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
