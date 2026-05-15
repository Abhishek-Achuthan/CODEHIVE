import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import type { IGetPublicNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/IGetPublicNoteUseCase';
import type { ISavePublicNoteUseCase } from '../../../application/useCase/interface/notes/ISavePublicNoteUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import {
  roomParamsSchema,
  savePublicNoteSchema,
} from '../../validation/noteValidation';

@injectable()
export class PublicNoteController {
  constructor(
    @inject('IGetPublicNoteUseCase')
    private readonly _getPublicNoteUseCase: IGetPublicNoteUseCase,
    @inject('ISavePublicNoteUseCase')
    private readonly _savePublicNoteUseCase: ISavePublicNoteUseCase,
  ) {}

  async handleGetPublicNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = roomParamsSchema.parse(req.params);
      const userId = req.user.id;

      const result = await this._getPublicNoteUseCase.execute({ roomId, userId });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleSavePublicNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = roomParamsSchema.parse(req.params);
      const { content } = savePublicNoteSchema.parse(req.body);
      const userId = req.user.id;

      const result = await this._savePublicNoteUseCase.execute({
        roomId,
        userId,
        content,
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
