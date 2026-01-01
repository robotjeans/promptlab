import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { RagService } from './rag/rag.service';
import { AppController } from './app.controller';
import { RagController } from './rag/rag.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController, HealthController, RagController],
  providers: [AppService, HealthService, RagService],
})
export class AppModule {}
