import { Router } from 'express';
import { container } from 'tsyringe';

import { RoomController } from '../controllers/room/RoomController';
import { MessageController } from '../controllers/message/MessageController';
import { PollController } from '../controllers/poll/PollController';
import { PrivateNoteController } from '../controllers/note/PrivateNoteController';
import { AuthMiddleware } from '../middlewares/authMIddleware';

export class RoomRoutes {
  private readonly _router: Router;
  private readonly _roomController: RoomController;
  private readonly _messageController: MessageController;
  private readonly _pollController: PollController;
  private readonly _privateNoteController: PrivateNoteController;
  private readonly _authMiddleware: AuthMiddleware;

  constructor() {
    this._router = Router();
    this._roomController = container.resolve(RoomController);
    this._messageController = container.resolve(MessageController);
    this._pollController = container.resolve(PollController);
    this._privateNoteController = container.resolve(PrivateNoteController);
    this._authMiddleware = container.resolve(AuthMiddleware);
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

    this._router.post(
      '/:roomId/messages',
      this._authMiddleware.check,
      this._messageController.handleCreateMessage.bind(this._messageController),
    );

    this._router.patch(
      '/:roomId/messages/:messageId',
      this._authMiddleware.check,
      this._messageController.handleEditMessage.bind(this._messageController),
    );

    this._router.delete(
      '/:roomId/messages/:messageId',
      this._authMiddleware.check,
      this._messageController.handleDeleteMessage.bind(this._messageController),
    );

    this._router.post(
      '/:roomId/polls',
      this._authMiddleware.check,
      this._pollController.handleCreatePoll.bind(this._pollController),
    );

    this._router.post(
      '/:roomId/polls/:pollId/votes',
      this._authMiddleware.check,
      this._pollController.handleSubmitVote.bind(this._pollController),
    );

    this._router.get(
      '/:roomId/polls/active',
      this._authMiddleware.check,
      this._pollController.handleGetActivePoll.bind(this._pollController),
    );

    this._router.get(
      '/:roomId/notes',
      this._authMiddleware.check,
      this._privateNoteController.handleGetPrivateNote.bind(this._privateNoteController),
    );

    this._router.put(
      '/:roomId/notes',
      this._authMiddleware.check,
      this._privateNoteController.handleSavePrivateNote.bind(this._privateNoteController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
