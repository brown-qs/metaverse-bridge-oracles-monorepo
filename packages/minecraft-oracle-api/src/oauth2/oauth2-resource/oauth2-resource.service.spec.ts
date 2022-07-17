import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2ResourceService } from './oauth2-resource.service';

describe('Oauth2ResourceService', () => {
  let service: Oauth2ResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2ResourceService],
    }).compile();

    service = module.get<Oauth2ResourceService>(Oauth2ResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
