import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2AuthorizationController } from './oauth2-authorization.controller';

describe('Oauth2AuthorizationController', () => {
  let controller: Oauth2AuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Oauth2AuthorizationController],
    }).compile();

    controller = module.get<Oauth2AuthorizationController>(Oauth2AuthorizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
