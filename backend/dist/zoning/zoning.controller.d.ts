import { FloorPlanDto } from './dto/floor-plan.dto';
import { ZoningResultDto } from './dto/zoning-result.dto';
import { ZoningService } from './zoning.service';
export declare class ZoningController {
    private readonly zoningService;
    private readonly logger;
    constructor(zoningService: ZoningService);
    generateZoning(floorPlan: FloorPlanDto): Promise<ZoningResultDto>;
}
