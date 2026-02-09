import { Test, TestingModule } from '@nestjs/testing';
import { BaseRepositoryService } from './base-repository.service';

describe('BaseRepositoryService', () => {
  let service: BaseRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseRepositoryService],
    }).compile();

    service = module.get<BaseRepositoryService>(BaseRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
