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

    this._router.get(
      '/mine',
      this._authMiddleware.check,
      this._roomController.handleGetMyRooms.bind(this._roomController),
    );

    this._router.get(
      '/:roomId/settings',
      this._authMiddleware.check,
      this._roomController.handleGetRoomSettings.bind(this._roomController),
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

    this._router.post(
      '/:roomId/end',
      this._authMiddleware.check,
      this._roomController.handleEndRoom.bind(this._roomController),
    );

    this._router.post(
      '/:roomId/invites',
      this._authMiddleware.check,
      this._roomController.handleCreateRoomInvite.bind(this._roomController),
    );

    this._router.post(
      '/:roomId/invites/regenerate',
      this._authMiddleware.check,
      this._roomController.handleRegenerateRoomInvite.bind(this._roomController),
    );

    this._router.get(
      '/:roomId/invites',
      this._authMiddleware.check,
      this._roomController.handleListRoomInvites.bind(this._roomController),
    );

    this._router.delete(
      '/:roomId/invites/:inviteId',
      this._authMiddleware.check,
      this._roomController.handleRevokeRoomInvite.bind(this._roomController),
    );

    this._router.post(
      '/:roomId/participants/:userId/kick',
      this._authMiddleware.check,
      this._roomController.handleKickParticipant.bind(this._roomController),
    );

    this._router.put(
      '/:roomId/participants/:userId/overrides',
      this._authMiddleware.check,
      this._roomController.handleUpdateParticipantOverrides.bind(this._roomController),
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
