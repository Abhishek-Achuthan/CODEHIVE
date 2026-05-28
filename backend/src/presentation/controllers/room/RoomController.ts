import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { ICreateRoomUseCase } from '../../../application/useCase/interface/room/ICreateRoomUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { IGetPublicRoomsUseCase } from '../../../application/useCase/interface/room/IGetPublicRoomsUseCase';
import type { IGetMyRoomsUseCase } from '../../../application/useCase/interface/room/IGetMyRoomsUseCase';
import type { IJoinRoomUseCase } from '../../../application/useCase/interface/room/IJoinRoomUseCase';
import type { ILeaveRoomUseCase } from '../../../application/useCase/interface/room/ILeaveRoomUseCase';
import type { ICreateRoomInviteUseCase } from '../../../application/useCase/interface/room/ICreateRoomInviteUseCase';
import type { IRegenerateRoomInviteUseCase } from '../../../application/useCase/interface/room/IRegenerateRoomInviteUseCase';
import type { IRevokeRoomInviteUseCase } from '../../../application/useCase/interface/room/IRevokeRoomInviteUseCase';
import type { IListRoomInvitesUseCase } from '../../../application/useCase/interface/room/IListRoomInvitesUseCase';
import type { IKickParticipantUseCase } from '../../../application/useCase/interface/room/IKickParticipantUseCase';
import type { IGetRoomSettingsUseCase } from '../../../application/useCase/interface/room/IGetRoomSettingsUseCase';
import type { IPresenceService } from '../../../application/ports/presence/IPresenceService';
import { BadRequestError } from '../../../core/errors/BadRequestError';

@injectable()
export class RoomController {
  constructor(
    @inject('ICreateRoomUseCase')
    private readonly _createRoomUseCase: ICreateRoomUseCase,
    @inject('IGetPublicRoomsUseCase')
    private readonly _getPublicRoomsUseCase: IGetPublicRoomsUseCase,
    @inject('IGetMyRoomsUseCase')
    private readonly _getMyRoomsUseCase: IGetMyRoomsUseCase,
    @inject('IJoinRoomUseCase')
    private readonly _joinRoomUseCase: IJoinRoomUseCase,
    @inject('ILeaveRoomUseCase')
    private readonly _leaveRoomUseCase: ILeaveRoomUseCase,
    @inject('IPresenceService')
    private readonly _presenceService: IPresenceService,
    @inject('ICreateRoomInviteUseCase')
    private readonly _createRoomInviteUseCase: ICreateRoomInviteUseCase,
    @inject('IRegenerateRoomInviteUseCase')
    private readonly _regenerateRoomInviteUseCase: IRegenerateRoomInviteUseCase,
    @inject('IRevokeRoomInviteUseCase')
    private readonly _revokeRoomInviteUseCase: IRevokeRoomInviteUseCase,
    @inject('IListRoomInvitesUseCase')
    private readonly _listRoomInvitesUseCase: IListRoomInvitesUseCase,
    @inject('IKickParticipantUseCase')
    private readonly _kickParticipantUseCase: IKickParticipantUseCase,
    @inject('IGetRoomSettingsUseCase')
    private readonly _getRoomSettingsUseCase: IGetRoomSettingsUseCase,
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

  async handleGetMyRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const pageParam = Number(req.query.page);
      const limitParam = Number(req.query.limit);

      const page = pageParam || 1;
      const limit = limitParam || 12;

      const rooms = await this._getMyRoomsUseCase.execute(req.user.id, {
        page,
        limit,
      });

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

  async handleCreateRoomInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const data = await this._createRoomInviteUseCase.execute(roomId, req.user.id);
      res.status(HttpStatus.Created).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleRegenerateRoomInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const data = await this._regenerateRoomInviteUseCase.execute(roomId, req.user.id);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleListRoomInvites(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const data = await this._listRoomInvitesUseCase.execute(roomId, req.user.id);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleRevokeRoomInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const inviteId = this.getRequiredParam(req, 'inviteId');
      await this._revokeRoomInviteUseCase.execute(roomId, inviteId, req.user.id);
      res.status(HttpStatus.NoContent).send();
    } catch (error) {
      next(error);
    }
  }

  async handleGetRoomSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const data = await this._getRoomSettingsUseCase.execute(roomId, req.user.id);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleKickParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const targetUserId = this.getRequiredParam(req, 'userId');
      await this._kickParticipantUseCase.execute({
        roomId,
        hostUserId: req.user.id,
        targetUserId,
      });
      res.status(HttpStatus.NoContent).send();
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
