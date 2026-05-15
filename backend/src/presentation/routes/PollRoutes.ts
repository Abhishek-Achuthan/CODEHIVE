import { Router } from 'express';
import { authMiddleware, pollController } from '../../config/di/resolver';

export class PollRoutes {
  private readonly _router: Router;
  private readonly _pollController;
  private readonly _authMiddleware;
  constructor() {
    this._router = Router({ mergeParams: true });
    this._pollController = pollController
    this._authMiddleware = authMiddleware;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      '/',
      this._authMiddleware.check,
      this._pollController.handleCreatePoll.bind(this._pollController),
    );

    this._router.post(
      '/:pollId/votes',
      this._authMiddleware.check,
      this._pollController.handleSubmitVote.bind(this._pollController),
    );

    this._router.get(
      '/active',
      this._authMiddleware.check,
      this._pollController.handleGetActivePoll.bind(this._pollController),
    );

    this._router.patch(
      '/:pollId/close',
      this._authMiddleware.check,
      this._pollController.handleClosePoll.bind(this._pollController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
