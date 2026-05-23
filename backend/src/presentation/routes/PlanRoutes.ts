import { Router } from 'express';
import { planController, authMiddleware, roleMiddleware } from '../../config/di/resolver';
import { UserRole } from '../../domain/types/UserRole';

export class PlanRoute {
  private readonly _router: Router;
  private readonly _planController;

  constructor() {
    this._router = Router();
    this._planController = planController;
    this.setRoutes();
  }

  private setRoutes(): void {
    this._router.post(
      '/',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleCreatePlan.bind(this._planController)
    );

    this._router.patch(
      '/:id',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleUpdatePlan.bind(this._planController)
    );

    this._router.get(
      '/',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleListActivePlans.bind(this._planController)
    );

    this._router.get(
      '/:id',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleGetPlanById.bind(this._planController)
    );

    this._router.get(
      '/:slug',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleGetPlanBySlug.bind(this._planController)
    );

    this._router.patch(
      '/:id/archive',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._planController.handleArchivePlan.bind(this._planController)
    );

  }

  public getRoutes(): Router {
    return this._router;
  }
}
