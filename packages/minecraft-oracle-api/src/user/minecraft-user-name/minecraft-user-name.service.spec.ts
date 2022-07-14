import { Test, TestingModule } from '@nestjs/testing';
import { MinecraftUserNameService } from './minecraft-user-name.service';

describe('MinecraftUserNameService', () => {
  let service: MinecraftUserNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinecraftUserNameService],
    }).compile();

    service = module.get<MinecraftUserNameService>(MinecraftUserNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
