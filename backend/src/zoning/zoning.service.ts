import { Injectable, Logger } from '@nestjs/common';
import { FloorPlanDto } from './dto/floor-plan.dto';
import { ZoningResultDto } from './dto/zoning-result.dto';
import { ML_PROCESSING_DELAY, DEFAULT_ZONES, MAX_ROOMS } from '../constants';
import { setTimeout } from 'timers';

@Injectable()
export class ZoningService {
  private readonly logger = new Logger(ZoningService.name);

  /**
   * Вспомогательная функция для имитации задержки
   */
  private async delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Генерация зонирования для плана помещения
   */
  async generateZoning(floorPlan: FloorPlanDto): Promise<ZoningResultDto> {
    this.logger.log(`Начата обработка плана с ${floorPlan.rooms.length} комнатами`);

    if (floorPlan.rooms.length > MAX_ROOMS) {
      this.logger.warn(`Превышено максимальное количество комнат: ${floorPlan.rooms.length}`);
    }

    await this.delay(ML_PROCESSING_DELAY);

    const result: ZoningResultDto = {
      zones: floorPlan.rooms.map(room => {
        const zoneKeys = Object.keys(DEFAULT_ZONES).map(Number);
        const zoneId =
          room.id <= Math.max(...zoneKeys)
            ? room.id
            : zoneKeys[Math.floor(Math.random() * zoneKeys.length)];

        return {
          roomId: room.id,
          zone: DEFAULT_ZONES[zoneId as keyof typeof DEFAULT_ZONES] || 'Нейтральная зона',
        };
      }),
    };

    this.logger.log(`Зонирование создано: ${result.zones.length} зон`);
    return result;
  }
}
