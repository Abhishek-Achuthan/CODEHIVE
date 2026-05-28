import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { IPreviewInviteUseCase } from '../../../application/useCase/interface/room/IPreviewInviteUseCase';
import type { IJoinRoomViaInviteUseCase } from '../../../application/useCase/interface/room/IJoinRoomViaInviteUseCase';
import type { IPresenceService } from '../../../application/ports/presence/IPresenceService';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { BadRequestError } from '../../../core/errors/BadRequestError';

@injectable()
export class InviteController {
  constructor(
    @inject('IPreviewInviteUseCase')
    private readonly _previewInviteUseCase: IPreviewInviteUseCase,
    @inject('IJoinRoomViaInviteUseCase')
    private readonly _joinRoomViaInviteUseCase: IJoinRoomViaInviteUseCase,
    @inject('IPresenceService')
    private readonly _presenceService: IPresenceService,
  ) {}

  async handlePreviewInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const code = this.getRequiredParam(req, 'code');
      const userId = req.user?.id;

      const preview = await this._previewInviteUseCase.execute(code, userId);

      res.status(HttpStatus.OK).json(preview);
    } catch (error) {
      next(error);
    }
  }

  async handleJoinViaInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const code = this.getRequiredParam(req, 'code');
      const userId = req.user.id;

      const snapshot = await this._joinRoomViaInviteUseCase.execute({
        inviteCode: code,
        userId,
      });

      res.status(HttpStatus.OK).json({
        ...snapshot,
        onlineUserIds: this._presenceService.getOnlineUserIds(snapshot.roomId),
      });
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
