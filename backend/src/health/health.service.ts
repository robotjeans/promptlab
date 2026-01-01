import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'promptlab-api',
    };
  }
}
