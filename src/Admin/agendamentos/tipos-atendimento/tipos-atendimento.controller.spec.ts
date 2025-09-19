import { Test, TestingModule } from '@nestjs/testing';
import { TiposAtendimentoController } from './tipos-atendimento.controller';
import { TiposAtendimentoService } from './tipos-atendimento.service';

describe('TiposAtendimentoController', () => {
  let controller: TiposAtendimentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposAtendimentoController],
      providers: [TiposAtendimentoService],
    }).compile();

    controller = module.get<TiposAtendimentoController>(TiposAtendimentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
