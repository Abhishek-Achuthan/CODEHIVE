import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import type { PlanResponseDTO } from '../../dto/PlanDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { IGetPlanBySlugUseCase } from '../interface/plan/IGetPlanBySlugUseCase';
import { PlanMapper } from '../../mapper/PlanMapper';

@injectable()
export class GetPlanBySlugUseCase implements IGetPlanBySlugUseCase {
    constructor(
        @inject('IPlanRepository') private readonly _planRepo: IPlanRepository
    ){}
    async execute(slug: string): Promise<PlanResponseDTO> {

        const plan = await this._planRepo.findBySlug(slug);

        if(!plan) throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);

        return PlanMapper.toResponse(plan);
    }
}