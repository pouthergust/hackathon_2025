import { Test, TestingModule } from '@nestjs/testing';
import { NasaResourcesService } from './nasa-resources.service';

describe('NasaResourcesService', () => {
  let service: NasaResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NasaResourcesService],
    }).compile();

    service = module.get<NasaResourcesService>(NasaResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
