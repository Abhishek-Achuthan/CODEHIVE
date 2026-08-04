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
import type { IUpdateRoomDetailsUseCase } from '../../../application/useCase/interface/room/IUpdateRoomDetailsUseCase';
import type { IUpdateParticipantOverridesUseCase } from '../../../application/useCase/interface/room/IUpdateParticipantOverridesUseCase';
import type { IEndRoomUseCase } from '../../../application/useCase/interface/room/IEndRoomUseCase';
import type { IReportParticipantUseCase } from '../../../application/useCase/interface/room/IReportParticipantUseCase';
import type { IGetVideoConfigUseCase } from '../../../application/useCase/interface/room/IGetVideoConfigUseCase';
import type { IPresenceService } from '../../../application/ports/presence/IPresenceService';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import {
  participantOverridesParamsSchema,
  updateParticipantOverridesBodySchema,
} from '../../validation/participantValidation';

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
    @inject('IUpdateRoomDetailsUseCase')
    private readonly _updateRoomDetailsUseCase: IUpdateRoomDetailsUseCase,
    @inject('IUpdateParticipantOverridesUseCase')
    private readonly _updateParticipantOverridesUseCase: IUpdateParticipantOverridesUseCase,
    @inject('IReportParticipantUseCase')
    private readonly _reportParticipantUseCase: IReportParticipantUseCase,
    @inject('IEndRoomUseCase')
    private readonly _endRoomUseCase: IEndRoomUseCase,
    @inject('IGetVideoConfigUseCase')
    private readonly _getVideoConfigUseCase: IGetVideoConfigUseCase,
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
      const searchParam = req.query.search;
      const search =
        typeof searchParam === 'string' ? searchParam.trim() : undefined;
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;

      const page = pageParam || 1;
      const limit = limitParam || 5

      const rooms = await this._getPublicRoomsUseCase.execute({
        page,
        limit,
        ...(search ? { search } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(status ? { status } : {}),
      });

      res.status(HttpStatus.OK).json(rooms);
    } catch (error) {
      next(error);
    }
  }

  async handleGetMyRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const pageParam = Number(req.query.page);
      const limitParam = Number(req.query.limit);
      const searchParam = req.query.search;
      const search =
        typeof searchParam === 'string' ? searchParam.trim() : undefined;
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;

      const page = pageParam || 1;
      const limit = limitParam || 12;

      const rooms = await this._getMyRoomsUseCase.execute(req.user.id, {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(status ? { status } : {}),
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

  async handleUpdateRoomDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const { title, description, visibility } = req.body;
      
      const data = await this._updateRoomDetailsUseCase.execute({
        roomId,
        hostUserId: req.user.id,
        title,
        description,
        visibility
      });
      
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

  async handleUpdateParticipantOverrides(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { roomId, userId: targetUserId } =
        participantOverridesParamsSchema.parse(req.params);
      const { overrides } = updateParticipantOverridesBodySchema.parse(req.body);

      const result = await this._updateParticipantOverridesUseCase.execute({
        roomId,
        executorUserId: req.user.id,
        targetUserId,
        overrides,
      });

      res.status(HttpStatus.OK).json(result);
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

  async handleEndRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');

      await this._endRoomUseCase.execute({
        roomId,
        hostUserId: req.user.id,
      });

      res.status(HttpStatus.NoContent).send();
    } catch (error) {
      next(error);
    }
  }

  async handleReportParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const reportedUserId = this.getRequiredParam(req, 'userId');
      const { reason, description } = req.body;
      
      if (!reason) {
        throw new BadRequestError('Reason is required for reporting');
      }

      await this._reportParticipantUseCase.execute(
        roomId,
        req.user.id,
        reportedUserId,
        reason,
        description
      );

      res.status(HttpStatus.Created).send();
    } catch (error) {
      next(error);
    }
  }

  async handleGetVideoConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;

      const data = await this._getVideoConfigUseCase.execute(roomId, userId);
      res.status(HttpStatus.OK).json(data);
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
