import { PlanResponseDTO } from "../../../dto/PlanDTO";

export interface IGetPlanBySlugUseCase {
    execute(slug:string):Promise<PlanResponseDTO>
}