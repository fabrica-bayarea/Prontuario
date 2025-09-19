import { Test, TestingModule } from '@nestjs/testing';
import { TiposAtendimentoService } from './tipos-atendimento.service';

describe('TiposAtendimentoService', () => {
  let service: TiposAtendimentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposAtendimentoService],
    }).compile();

    service = module.get<TiposAtendimentoService>(TiposAtendimentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
