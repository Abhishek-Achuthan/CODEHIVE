import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { IGetPrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/IGetPrivateNoteUseCase';
import type { ISavePrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/ISavePrivateNoteUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import {
  roomParamsSchema,
  savePrivateNoteSchema,
} from '../../validation/noteValidation';

@injectable()
export class PrivateNoteController {
  constructor(
    @inject('IGetPrivateNoteUseCase')
    private readonly _getPrivateNoteUseCase: IGetPrivateNoteUseCase,
    @inject('ISavePrivateNoteUseCase')
    private readonly _savePrivateNoteUseCase: ISavePrivateNoteUseCase,
  ) {}

  async handleGetPrivateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = roomParamsSchema.parse(req.params);
      const userId = req.user.id;

      const data = await this._getPrivateNoteUseCase.execute({ roomId, userId });

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleSavePrivateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = roomParamsSchema.parse(req.params);
      const { content } = savePrivateNoteSchema.parse(req.body);
      const userId = req.user.id;

      const data = await this._savePrivateNoteUseCase.execute({
        userId,
        roomId,
        content,
      });

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
}
