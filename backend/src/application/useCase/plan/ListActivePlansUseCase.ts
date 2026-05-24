import { inject, injectable } from 'tsyringe';
import { IListActivePlansUseCase } from '../interface/plan/IListActivePlansUseCase';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { PlanResponseDTO } from '../../dto/PlanDTO';
import { PlanMapper } from '../../mapper/PlanMapper';

@injectable()
export class ListActivePlansUseCase implements IListActivePlansUseCase {
    constructor(
        @inject('IPlanRepository') private readonly _planRepo: IPlanRepository
    ){}
    async execute(
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<PaginationResult<PlanResponseDTO>> {
        const plansResult = await this._planRepo.findAllActive({ page, limit, search });

        return {
            items: PlanMapper.toResponseList(plansResult.items),
            totalItems: plansResult.totalItems,
            totalPages: plansResult.totalPages
        };
    }
}