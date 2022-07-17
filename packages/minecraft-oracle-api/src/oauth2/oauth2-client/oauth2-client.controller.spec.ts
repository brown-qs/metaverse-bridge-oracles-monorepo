import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2ClientController } from './oauth2-client.controller';

describe('Oauth2ClientController', () => {
  let controller: Oauth2ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Oauth2ClientController],
    }).compile();

    controller = module.get<Oauth2ClientController>(Oauth2ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
