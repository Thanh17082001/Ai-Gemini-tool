import { Test, TestingModule } from '@nestjs/testing';
import { AiClientController } from './ai-client.controller';
import { AiClientService } from './ai-client.service';

describe('AiClientController', () => {
  let controller: AiClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiClientController],
      providers: [AiClientService],
    }).compile();

    controller = module.get<AiClientController>(AiClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
