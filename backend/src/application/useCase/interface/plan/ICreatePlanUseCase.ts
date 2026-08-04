import { CreatePlanDTO, PlanResponseDTO } from '../../../dto/PlanDTO';

export interface ICreatePlanUseCase {
    execute(data:CreatePlanDTO):Promise<PlanResponseDTO>
}