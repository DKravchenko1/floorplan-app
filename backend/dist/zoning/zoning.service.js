"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ZoningService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoningService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const timers_1 = require("timers");
let ZoningService = ZoningService_1 = class ZoningService {
    constructor() {
        this.logger = new common_1.Logger(ZoningService_1.name);
    }
    async delay(ms) {
        return new Promise(resolve => {
            (0, timers_1.setTimeout)(resolve, ms);
        });
    }
    async generateZoning(floorPlan) {
        this.logger.log(`Начата обработка плана с ${floorPlan.rooms.length} комнатами`);
        if (floorPlan.rooms.length > constants_1.MAX_ROOMS) {
            this.logger.warn(`Превышено максимальное количество комнат: ${floorPlan.rooms.length}`);
        }
        await this.delay(constants_1.ML_PROCESSING_DELAY);
        const result = {
            zones: floorPlan.rooms.map(room => {
                const zoneKeys = Object.keys(constants_1.DEFAULT_ZONES).map(Number);
                const zoneId = room.id <= Math.max(...zoneKeys)
                    ? room.id
                    : zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
                return {
                    roomId: room.id,
                    zone: constants_1.DEFAULT_ZONES[zoneId] || 'Нейтральная зона',
                };
            }),
        };
        this.logger.log(`Зонирование создано: ${result.zones.length} зон`);
        return result;
    }
};
exports.ZoningService = ZoningService;
exports.ZoningService = ZoningService = ZoningService_1 = __decorate([
    (0, common_1.Injectable)()
], ZoningService);
//# sourceMappingURL=zoning.service.js.map