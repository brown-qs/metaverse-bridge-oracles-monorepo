import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2AuthorizationService } from './oauth2-authorization.service';

describe('Oauth2AuthorizationService', () => {
  let service: Oauth2AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2AuthorizationService],
    }).compile();

    service = module.get<Oauth2AuthorizationService>(Oauth2AuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
