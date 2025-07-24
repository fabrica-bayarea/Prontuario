import { Test, TestingModule } from '@nestjs/testing';
import { ProgramasService } from './programas.service';

describe('ProgramasService', () => {
  let service: ProgramasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramasService],
    }).compile();

    service = module.get<ProgramasService>(ProgramasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
