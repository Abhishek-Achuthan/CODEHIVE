import { Router } from 'express';
import { container } from 'tsyringe';

import { RoomController } from '../controllers/room/RoomController';
import { AuthMiddleware } from '../middlewares/authMIddleware';

export class RoomRoutes {
  private readonly _router: Router;
  private readonly _roomController: RoomController;
  private readonly _authMiddleware: AuthMiddleware;

  constructor() {
    this._router = Router();
    this._roomController = container.resolve(RoomController);
    this._authMiddleware = container.resolve(AuthMiddleware);
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      '/',
      this._authMiddleware.check,
      this._roomController.handleCreateRoom.bind(this._roomController)
    );

    this._router.get(
      '/',
      this._roomController.handleGetPublicRooms.bind(this._roomController)
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
