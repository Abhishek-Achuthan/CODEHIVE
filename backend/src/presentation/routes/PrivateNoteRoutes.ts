import { Router } from 'express';
import { container } from 'tsyringe';
import { PrivateNoteController } from '../controllers/note/PrivateNoteController';
import { AuthMiddleware } from '../middlewares/authMIddleware';

export class PrivateNoteRoutes {
  private readonly _router: Router;
  private readonly _privateNoteController: PrivateNoteController;
  private readonly _authMiddleware: AuthMiddleware;

  constructor() {
    this._router = Router({ mergeParams: true });
    this._privateNoteController = container.resolve(PrivateNoteController);
    this._authMiddleware = container.resolve(AuthMiddleware);
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      '/',
      this._authMiddleware.check,
      this._privateNoteController.handleGetPrivateNote.bind(this._privateNoteController),
    );

    this._router.put(
      '/',
      this._authMiddleware.check,
      this._privateNoteController.handleSavePrivateNote.bind(this._privateNoteController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
