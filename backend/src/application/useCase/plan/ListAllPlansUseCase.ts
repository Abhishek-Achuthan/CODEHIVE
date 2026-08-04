import { injectable, inject } from 'tsyringe';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import type { PlanResponseDTO } from '../../dto/PlanDTO';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { PlanMapper } from '../../mapper/PlanMapper';
import { IListAllPlansUseCase } from '../interface/plan/IListAllPlansUseCase';

@injectable()
export class ListAllPlansUseCase implements IListAllPlansUseCase {
    constructor(
        @inject('IPlanRepository') private readonly _planRepo: IPlanRepository
    ){}
    async execute(
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<PaginationResult<PlanResponseDTO>> {
        const plansResult = await this._planRepo.findAllPlans({ page, limit, search });

        return {
            items: PlanMapper.toResponseList(plansResult.items),
            totalItems: plansResult.totalItems,
            totalPages: plansResult.totalPages
        };
    }
}