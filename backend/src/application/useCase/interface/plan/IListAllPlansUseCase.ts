import { PaginationResult } from "../../../../domain/types/PaginationResult";
import { PlanResponseDTO } from "../../../dto/PlanDTO";

export interface IListAllPlansUseCase {
  execute(page?: number, limit?: number, search?: string): Promise<PaginationResult<PlanResponseDTO>>
}