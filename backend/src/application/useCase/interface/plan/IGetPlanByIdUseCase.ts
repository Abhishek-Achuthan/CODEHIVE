import { PlanResponseDTO } from "../../../dto/PlanDTO";

export interface IGetPlanByIdUseCase {
    execute(id:string): Promise<PlanResponseDTO>
}