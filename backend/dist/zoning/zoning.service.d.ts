import { FloorPlanDto } from './dto/floor-plan.dto';
import { ZoningResultDto } from './dto/zoning-result.dto';
export declare class ZoningService {
    private readonly logger;
    private delay;
    generateZoning(floorPlan: FloorPlanDto): Promise<ZoningResultDto>;
}
