import { Test, TestingModule } from '@nestjs/testing';
import { EscalasController } from './escalas.controller';
import { EscalasService } from './escalas.service';

describe('EscalasController', () => {
  let controller: EscalasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EscalasController],
      providers: [EscalasService],
    }).compile();

    controller = module.get<EscalasController>(EscalasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
