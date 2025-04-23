import { Module } from '@nestjs/common';
import { ZoningController } from './zoning/zoning.controller';
import { ZoningService } from './zoning/zoning.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [],
  controllers: [ZoningController, HealthController],
  providers: [ZoningService],
})
export class AppModule {}
