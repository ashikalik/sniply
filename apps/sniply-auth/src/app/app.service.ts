import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      service: 'sniply-auth',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
