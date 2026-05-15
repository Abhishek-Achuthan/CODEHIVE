import { Router } from 'express';
import { MessageRoutes } from './MessageRoutes';
import { PollRoutes } from './PollRoutes';
import { PrivateNoteRoutes } from './PrivateNoteRoutes';
import { PublicNoteRoutes } from './PublicNoteRoutes';
import { authMiddleware, roomController } from '../../config/di/resolver';

export class RoomRoutes {
  private readonly _router: Router;
  private readonly _roomController;
  private readonly _authMiddleware;

  constructor() {
    this._router = Router();
    this._roomController = roomController
    this._authMiddleware = authMiddleware
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      '/',
      this._authMiddleware.check,
      this._roomController.handleCreateRoom.bind(this._roomController),
    );

    this._router.get(
      '/',
      this._roomController.handleGetPublicRooms.bind(this._roomController),
    );

    this._router.post(
      '/:roomId/join',
      this._authMiddleware.check,
      this._roomController.handleJoinRoom.bind(this._roomController),
    );

    this._router.post(
      '/:roomId/leave',
      this._authMiddleware.check,
      this._roomController.handleLeaveRoom.bind(this._roomController),
    );

    this._router.use('/:roomId/messages', new MessageRoutes().getRoutes());
    this._router.use('/:roomId/polls', new PollRoutes().getRoutes());
    this._router.use('/:roomId/private-notes', new PrivateNoteRoutes().getRoutes());
    this._router.use('/:roomId/public-notes', new PublicNoteRoutes().getRoutes());
  }

  public getRoutes(): Router {
    return this._router;
  }
}
