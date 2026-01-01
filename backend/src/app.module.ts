import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
