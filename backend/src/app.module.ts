import { Module } from '@nestjs/common';
import { ZoningController } from './zoning/zoning.controller';
import { ZoningService } from './zoning/zoning.service';

@Module({
  imports: [],
  controllers: [ZoningController],
  providers: [ZoningService],
})
export class AppModule {}
