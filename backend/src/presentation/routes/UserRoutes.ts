import { Router } from 'express';
import { questionController } from '../../config/di/resolver';
import { answerController } from '../../config/di/resolver';
import { authMiddleware } from '../../config/di/resolver';
import { userController } from '../../config/di/resolver';

export class UserRoute {
  private _router: Router;
  private _questionController;
  private _answerController;
  private _authMiddleware;
  private _userController;

  constructor() {
    this._router = Router();
    this._questionController = questionController;
    this._answerController = answerController;
    this._authMiddleware = authMiddleware;
    this._userController = userController;

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
   this._router.patch(
    '/me/profile',
    this._authMiddleware.check,
    this._userController.handleUpdateProfile.bind(
      this._userController
    )
   );
    this._router.post('/me/mentor-applications',
      this._authMiddleware.check,
      this._userController.handleApplyForMentor.bind(
        this._userController
      )
    );
    this._router.get(
      '/me/activity',
      this._authMiddleware.check,
      this._userController.handleGetMyActivity.bind(
        this._userController
      )
    );

  }

  public getRoutes(): Router {
    return this._router;
  }
}
