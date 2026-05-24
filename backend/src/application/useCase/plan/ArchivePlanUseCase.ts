import { injectable,inject } from 'tsyringe';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { IArchivePlanUseCase } from '../interface/plan/IArchivePlanUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { PlanMapper } from '../../mapper/PlanMapper';
import { PlanResponseDTO } from '../../dto/PlanDTO';
import { InternalServerError } from '../../../core/errors/InternalServerError';


@injectable()
export class ArchivePlanUseCase implements IArchivePlanUseCase {
    constructor(
        @inject('IPlanRepository') private readonly _planRepo: IPlanRepository
    ) {}
    async execute(planId:string): Promise<PlanResponseDTO> {
        const existingPlan = await this._planRepo.find(planId);

        if (!existingPlan) throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);

        existingPlan.isActive = false;

        const updatedPlan = await this._planRepo.update(planId, existingPlan);

        if (!updatedPlan)  throw new InternalServerError(ERROR_MESSAGES.PLAN.UPDATE_FAILED);

        return PlanMapper.toCreateResponse(updatedPlan);
    }
}
