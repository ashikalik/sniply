import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return healthy service metadata', () => {
    const result = service.health() as {
      service: string;
      status: string;
      timestamp: string;
    };
    expect(result.service).toBe('sniply-auth');
    expect(result.status).toBe('ok');
    expect(typeof result.timestamp).toBe('string');
  });
});
