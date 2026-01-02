import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { SkipThrottle } from '../common/skip-throttle.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @SkipThrottle()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'promptlab-backend',
    };
  }
}
