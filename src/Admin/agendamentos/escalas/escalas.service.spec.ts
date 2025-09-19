import { Test, TestingModule } from '@nestjs/testing';
import { EscalasService } from './escalas.service';

describe('EscalasService', () => {
  let service: EscalasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EscalasService],
    }).compile();

    service = module.get<EscalasService>(EscalasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
