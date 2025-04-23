import { Body, Controller, Post, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FloorPlanDto } from './dto/floor-plan.dto';
import { ZoningResultDto } from './dto/zoning-result.dto';
import { ZoningService } from './zoning.service';

@Controller('api')
export class ZoningController {
  private readonly logger = new Logger(ZoningController.name);

  constructor(private readonly zoningService: ZoningService) {}

  @Post('generate-zoning')
  async generateZoning(@Body() floorPlan: FloorPlanDto): Promise<ZoningResultDto> {
    try {
      this.logger.log(
        `Получен запрос на генерацию зонирования для ${floorPlan.rooms.length} комнат`,
      );

      if (floorPlan.rooms.length === 0) {
        throw new HttpException(
          'Невозможно сгенерировать зонирование для пустого списка комнат',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.zoningService.generateZoning(floorPlan);
      this.logger.log('Зонирование успешно сгенерировано');

      return result;
    } catch (error) {
      this.logger.error(`Ошибка при генерации зонирования: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Внутренняя ошибка сервера при генерации зонирования',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
