import { Test, TestingModule } from '@nestjs/testing';
import { coordenadorService } from './coordenador.service';

describe('coordenadorService', () => {
  let service: coordenadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [coordenadorService],
    }).compile();

    service = module.get<coordenadorService>(coordenadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
