import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return auth health payload', () => {
      const response = appController.health() as {
        service: string;
        status: string;
        timestamp: string;
      };
      expect(response.service).toBe('sniply-auth');
      expect(response.status).toBe('ok');
      expect(typeof response.timestamp).toBe('string');
    });
  });
});
