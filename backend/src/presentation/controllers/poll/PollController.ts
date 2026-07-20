import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { IRoomEventEmitter } from '../../../application/ports/realtime/IRoomEventEmitter';
import type { ICreatePollUseCase } from '../../../application/useCase/interface/poll/ICreatePollUseCase';
import type { ISubmitPollVoteUseCase } from '../../../application/useCase/interface/poll/ISubmitPollVoteUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { HttpStatus } from '../../../shared/httpStatusCode';
import {
  createPollSchema,
  submitPollVoteSchema,
} from '../../validation/pollValidation';
import type { IGetActivePollUseCase } from '../../../application/useCase/interface/poll/IGetActivePollUseCase';
import type { IClosePollUseCase } from '../../../application/useCase/interface/poll/IClosePollUseCase';
import { PollEntity } from '../../../domain/entities/room/PollEntity';
import type { IGetClosePollUseCase } from '../../../application/useCase/interface/poll/IGetClosePollUseCase';

@injectable()
export class PollController {
  constructor(
    @inject('ICreatePollUseCase')
    private readonly _createPollUseCase: ICreatePollUseCase,
    @inject('ISubmitPollVoteUseCase')
    private readonly _submitPollVoteUseCase: ISubmitPollVoteUseCase,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
    @inject('IGetActivePollUseCase')
    private readonly _getActivePollUseCase: IGetActivePollUseCase,
    @inject('IClosePollUseCase')
    private readonly _closePollUseCase: IClosePollUseCase,
    @inject('IGetClosePollUseCase')
    private readonly _getClosePollUseCase: IGetClosePollUseCase,
  ) {}

  async handleCreatePoll(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;
      const validated = createPollSchema.parse(req.body);

      const poll = await this._createPollUseCase.execute({
        roomId,
        createdBy: userId,
        question: validated.question,
        options: validated.options.map((option) => ({ text: option.text })),
        ...(validated.allowMultiple !== undefined && {
          allowMultiple: validated.allowMultiple,
        }),
        ...(validated.expiresAt && {
          expiresAt: new Date(validated.expiresAt),
        }),
      });

      this._roomEventEmitter.emitPollCreated(poll.roomId, poll);

      res.status(HttpStatus.Created).json(poll);
    } catch (error) {
      next(error);
    }
  }

  async handleSubmitVote(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const pollId = this.getRequiredParam(req, 'pollId');
      const userId = req.user.id;
      const { optionIds } = submitPollVoteSchema.parse(req.body);

      const poll = await this._submitPollVoteUseCase.execute({
        pollId,
        userId,
        optionIds,
      });

      this._roomEventEmitter.emitPollVoted(poll.roomId, poll);

      res.status(HttpStatus.OK).json(poll);
    } catch (error) {
      next(error);
    }
  }

  async handleGetActivePoll(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;

      const activePoll = await this._getActivePollUseCase.execute({ roomId, userId });

      res.status(HttpStatus.OK).json(activePoll);
    } catch (error) {
      next(error);
    }
  }

  async handleClosePoll(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const pollId = this.getRequiredParam(req, 'pollId');
      const userId = req.user.id;

      const poll = await this._closePollUseCase.execute({
        pollId,
        userId,
        roomId,
      });

      this._roomEventEmitter.emitPollEnded((poll as PollEntity).roomId,poll as PollEntity);

      res.status(HttpStatus.OK).json(poll);
    } catch (error) {
      next(error);
    }
  }

  async handleGetClosedPoll(req: Request, res: Response,next : NextFunction) {
    try {
      const roomId = this.getRequiredParam(req,'roomId');
      const closedPolls = await this._getClosePollUseCase.execute(roomId);
      res.status(HttpStatus.OK).json(closedPolls)
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
