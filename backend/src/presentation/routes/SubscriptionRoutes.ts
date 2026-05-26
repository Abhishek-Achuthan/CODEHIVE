import { Router } from "express";
import { authMiddleware, subscriptionController } from "../../config/di/resolver";
import { injectable } from "tsyringe";


@injectable()
export class SubscriptionRoutes {
  private subscripionController;
  private _router: Router
  private authMiddleWare;
  constructor() {
    this._router = Router();
    this.subscripionController = subscriptionController
    this.authMiddleWare = authMiddleware;
    this.setRoutes();
  }

  setRoutes() {
    this._router.post('/checkout',
      this.authMiddleWare.check,
      this.subscripionController.handleCheckoutSession.bind(this.subscripionController)
    );

    this._router.get('/me',
      this.authMiddleWare.check,
      this.subscripionController.handleGetActiveSubscription.bind(this.subscripionController)
    );
  }

  getRoutes() {
    return this._router;
  }
}
