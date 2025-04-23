"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ZoningController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoningController = void 0;
const common_1 = require("@nestjs/common");
const floor_plan_dto_1 = require("./dto/floor-plan.dto");
const zoning_service_1 = require("./zoning.service");
let ZoningController = ZoningController_1 = class ZoningController {
    constructor(zoningService) {
        this.zoningService = zoningService;
        this.logger = new common_1.Logger(ZoningController_1.name);
    }
    async generateZoning(floorPlan) {
        try {
            this.logger.log(`Получен запрос на генерацию зонирования для ${floorPlan.rooms.length} комнат`);
            if (floorPlan.rooms.length === 0) {
                throw new common_1.HttpException('Невозможно сгенерировать зонирование для пустого списка комнат', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.zoningService.generateZoning(floorPlan);
            this.logger.log('Зонирование успешно сгенерировано');
            return result;
        }
        catch (error) {
            this.logger.error(`Ошибка при генерации зонирования: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Внутренняя ошибка сервера при генерации зонирования', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ZoningController = ZoningController;
__decorate([
    (0, common_1.Post)('generate-zoning'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [floor_plan_dto_1.FloorPlanDto]),
    __metadata("design:returntype", Promise)
], ZoningController.prototype, "generateZoning", null);
exports.ZoningController = ZoningController = ZoningController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [zoning_service_1.ZoningService])
], ZoningController);
//# sourceMappingURL=zoning.controller.js.map