import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { ICreatePlanUseCase } from '../../../application/useCase/interface/plan/ICreatePlanUseCase';
import type { IUpdatePlanUseCase } from '../../../application/useCase/interface/plan/IUpdatePlanUseCase';
import type { IListActivePlansUseCase } from '../../../application/useCase/interface/plan/IListActivePlansUseCase';
import type { IArchivePlanUseCase } from '../../../application/useCase/interface/plan/IArchivePlanUseCase';
import type { IGetPlanByIdUseCase } from '../../../application/useCase/interface/plan/IGetPlanByIdUseCase';
import type { IGetPlanBySlugUseCase } from '../../../application/useCase/interface/plan/IGetPlanBySlugUseCase';
import type { ISyncPlanStripeCatalogUseCase } from '../../../application/useCase/interface/plan/ISyncPlanStripeCatalogUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { createPlanSchema, planIdParamSchema, updatePlanSchema, planSlugParamSchema, listPlansQuerySchema } from '../../validation/planValidation';
import { PlanMapper } from '../../../application/mapper/PlanMapper';

@injectable()
export class PlanController {
  constructor(
    @inject('ICreatePlanUseCase')
    private readonly _createPlanUseCase: ICreatePlanUseCase,
    @inject('IUpdatePlanUseCase')
    private readonly _updatePlanUseCase: IUpdatePlanUseCase,
    @inject('IListActivePlansUseCase')
    private readonly _listActivePlansUseCase: IListActivePlansUseCase,
    @inject('IArchivePlanUseCase')
    private readonly _archivePlanUseCase: IArchivePlanUseCase,
    @inject('IGetPlanByIdUseCase')
    private readonly _getPlanByIdUseCase: IGetPlanByIdUseCase,
    @inject('IGetPlanBySlugUseCase')
    private readonly _getPlanBySlugUseCase: IGetPlanBySlugUseCase,
    @inject('ISyncPlanStripeCatalogUseCase')
    private readonly _syncPlanStripeCatalogUseCase: ISyncPlanStripeCatalogUseCase,
  ) {}

  async handleCreatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPlanSchema.parse(req.body);

      const data = await this._createPlanUseCase.execute(validatedData);

       res.status(HttpStatus.Created).json(data);
      
    } catch (error) {
      next(error);
    }
  }

  async handleUpdatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = planIdParamSchema.parse(req.params);
      const validatedBody = updatePlanSchema.parse(req.body);

      const data = await this._updatePlanUseCase.execute({
        planId: id,
        ...validatedBody,
      });

       res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleListActivePlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = listPlansQuerySchema.parse(req.query);
      const data = await this._listActivePlansUseCase.execute(
        page,
        limit,
        search
      );
       res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleArchivePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = planIdParamSchema.parse(req.params);
      const data = await this._archivePlanUseCase.execute(id);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = planIdParamSchema.parse(req.params);
      const data = await this._getPlanByIdUseCase.execute(id);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPlanBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = planSlugParamSchema.parse(req.params);
      const data = await this._getPlanBySlugUseCase.execute(slug);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleSyncPlanStripe(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = planIdParamSchema.parse(req.params);
      const plan = await this._syncPlanStripeCatalogUseCase.execute(id, {
        recreatePrices: true,
      });
      return res.status(HttpStatus.OK).json(PlanMapper.toCreateResponse(plan));
    } catch (error) {
      next(error);
    }
  }
}
