import { PlanResponseDTO } from "../../../dto/PlanDTO";

export interface IArchivePlanUseCase {
    execute(planId:string): Promise<PlanResponseDTO>;

}