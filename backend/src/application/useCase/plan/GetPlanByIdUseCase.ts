import { inject, injectable } from "tsyringe";
import { IGetPlanByIdUseCase } from "../interface/plan/IGetPlanByIdUseCase";
import type { IPlanRepository } from "../../../domain/interfaces/IPlanRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { PlanResponseDTO } from "../../dto/PlanDTO";
import { PlanMapper } from "../../mapper/PlanMapper";

@injectable()
export class GetPlanByIdUseCase implements IGetPlanByIdUseCase {
    constructor(
        @inject('IPlanRepository') private readonly _planRepo: IPlanRepository
    ){}
    async execute(id: string): Promise<PlanResponseDTO> {
        const plan = await this._planRepo.find(id);

        if(!plan) throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);

        return PlanMapper.toResponse(plan);
    }
}