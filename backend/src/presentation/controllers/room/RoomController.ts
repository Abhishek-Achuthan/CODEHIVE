import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { ICreateRoomUseCase } from '../../../application/useCase/interface/room/ICreateRoomUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { IGetPublicRoomsUseCase } from '../../../application/useCase/interface/room/IGetPublicRoomsUseCase';
import type { IJoinRoomUseCase } from '../../../application/useCase/interface/room/IJoinRoomUseCase';
import type { ILeaveRoomUseCase } from '../../../application/useCase/interface/room/ILeaveRoomUseCase';
import type { IPresenceService } from '../../../application/ports/presence/IPresenceService';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import type { IGetPrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/IGetPrivateNoteUseCase';
import type { ISavePrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/ISavePrivateNoteUseCase';

@injectable()
export class RoomController {
  constructor(
    @inject('ICreateRoomUseCase')
    private readonly _createRoomUseCase: ICreateRoomUseCase,
    @inject('IGetPublicRoomsUseCase')
    private readonly _getPublicRoomsUseCase: IGetPublicRoomsUseCase,
    @inject('IJoinRoomUseCase')
    private readonly _joinRoomUseCase: IJoinRoomUseCase,
    @inject('ILeaveRoomUseCase')
    private readonly _leaveRoomUseCase: ILeaveRoomUseCase,
    @inject('IPresenceService')
    private readonly _presenceService: IPresenceService,
    @inject('IGetPrivateNoteUseCase')
    private readonly _getPrivateNoteUseCase : IGetPrivateNoteUseCase,
    @inject('ISavePrivateNoteUseCase')
    private readonly _savePrivateNoteUseCase : ISavePrivateNoteUseCase,
  ) {}

  async handleCreateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { title, description, visibility } = req.body;

      const room = await this._createRoomUseCase.execute({
        title,
        description,
        visibility,
        userId,
      });

      res.status(HttpStatus.Created).json(room);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPublicRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const pageParam = Number(req.query.page);
      const limitParam = Number(req.query.limit);

      const page = pageParam || 1;
      const limit = limitParam || 5

      const rooms = await this._getPublicRoomsUseCase.execute({page,limit});

      res.status(HttpStatus.OK).json(rooms);
    } catch (error) {
      next(error);
    }
  }

  async handleJoinRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;

      const snapshot = await this._joinRoomUseCase.execute({
        roomId,
        userId,
      });

      res.status(HttpStatus.OK).json({
        ...snapshot,
        onlineUserIds: this._presenceService.getOnlineUserIds(roomId),
      });
    } catch (error) {
      next(error);
    }
  }

  async handleLeaveRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;

      await this._leaveRoomUseCase.execute({
        roomId,
        userId,
      });

      res.status(HttpStatus.NoContent).send();
    } catch (error) {
      next(error);
    }
  }

  private getRequiredParam(req: Request, key: string): string {
    const value = req.params[key];
    if (!value) {
      throw new BadRequestError(`${key} is required`);
    }
    return value;
  }
}
