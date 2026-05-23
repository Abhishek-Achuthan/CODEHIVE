import { inject, injectable } from "tsyringe";
import { ICreatePlanUseCase } from "../interface/plan/ICreatePlanUseCase";
import { CreatePlanDTO, PlanResponseDTO } from "../../dto/PlanDTO";
import type { IPlanRepository } from "../../../domain/interfaces/IPlanRepository";
import { ConflictError } from "../../../core/errors/ConflictError";
import { PlanMapper } from "../../mapper/PlanMapper";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(
    @inject("IPlanRepository")
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(data: CreatePlanDTO): Promise<PlanResponseDTO> {

    const normalizedSlug = data.slug.trim().toLowerCase();

    const existingPlan = await this._planRepository.findBySlug(normalizedSlug);

    if (existingPlan) throw new ConflictError(ERROR_MESSAGES.PLAN.ALREADY_EXIST);

    const features = [...new Set(data.features ?? [])];

    const limits = data.limits ?? {};

    const createdPlan = await this._planRepository.create({
      name: data.name,
      slug: normalizedSlug,
      ...(data.description !== undefined ? { description: data.description } : {}),
      isActive: true,
      isPublic: data.isPublic ?? true,
      sortOrder: data.sortOrder ?? 0,
      features,
      limits,
      pricing: {
        monthly: data.pricing.monthly,
        yearly: data.pricing.yearly,
        currency: data.pricing.currency.toUpperCase().trim(),
      },
    });

    return PlanMapper.toCreateResponse(createdPlan);
  }
}