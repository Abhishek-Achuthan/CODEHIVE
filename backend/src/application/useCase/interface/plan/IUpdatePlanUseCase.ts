import { PlanResponseDTO, UpdatePlanDTO } from '../../../dto/PlanDTO';

export interface IUpdatePlanUseCase {
    execute(data:UpdatePlanDTO):Promise<PlanResponseDTO>
}