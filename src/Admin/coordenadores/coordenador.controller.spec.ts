import { Test, TestingModule } from '@nestjs/testing';
import { CoordenadorController } from './coordenador.controller';

describe('CoordenadorController', () => {
  let controller: CoordenadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordenadorController],
    }).compile();

    controller = module.get<CoordenadorController>(CoordenadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
