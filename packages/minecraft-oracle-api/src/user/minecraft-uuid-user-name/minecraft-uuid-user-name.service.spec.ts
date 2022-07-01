import { Test, TestingModule } from '@nestjs/testing';
import { MinecraftUuidUserNameService } from './minecraft-uuid-user-name.service';

describe('MinecraftUuidUserNameService', () => {
  let service: MinecraftUuidUserNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinecraftUuidUserNameService],
    }).compile();

    service = module.get<MinecraftUuidUserNameService>(MinecraftUuidUserNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
