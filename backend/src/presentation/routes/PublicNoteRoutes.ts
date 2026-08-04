import { Router } from 'express';
import { PublicNoteController } from '../controllers/note/PublicNoteController';
import { AuthMiddleware } from '../middlewares/authMIddleware';
import { authMiddleware, publicNoteController } from '../../config/di/resolver';

export class PublicNoteRoutes {
  private readonly _router: Router;
  private readonly _publicNoteController: PublicNoteController;
  private readonly _authMiddleware: AuthMiddleware;

  constructor() {
    this._router = Router({ mergeParams: true });
    this._publicNoteController = publicNoteController;
    this._authMiddleware = authMiddleware;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      '/',
      this._authMiddleware.check,
      this._publicNoteController.handleGetPublicNote.bind(this._publicNoteController),
    );

    this._router.put(
      '/',
      this._authMiddleware.check,
      this._publicNoteController.handleSavePublicNote.bind(this._publicNoteController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
