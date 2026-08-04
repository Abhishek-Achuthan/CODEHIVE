import type { PaginationResult } from '../../../../domain/types/PaginationResult';
import type { PlanResponseDTO } from '../../../dto/PlanDTO';

export interface IListActivePlansUseCase {
    execute(page: number, limit: number, search?: string): Promise<PaginationResult<PlanResponseDTO>>
}