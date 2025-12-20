import { Router } from 'express';
import { questionController } from '../../config/di/resolver';
import { answerController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';

export class UserRoute {
  private _router: Router;
  private _questionController;
  private _answerController;
  private _authMiddleware;

  constructor() {
    this._router = Router();
    this._questionController = questionController;
    this._answerController = answerController;
    this._authMiddleware = authMiddleware;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      '/:userId/questions',
      this._authMiddleware.check,
      this._questionController.handleListUserQuestions.bind(
        this._questionController
      )
    );
    this._router.get(
    '/me/answers/questions',
    this._authMiddleware.check,
    this._questionController.handleListAnsweredQuestions.bind(
        this._questionController
    )
   );

  }

  public getRoutes(): Router {
    return this._router;
  }
}
