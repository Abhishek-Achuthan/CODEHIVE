import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { IGetPrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/IGetPrivateNoteUseCase';
import type { ISavePrivateNoteUseCase } from '../../../application/useCase/interface/notes/privateNote/ISavePrivateNoteUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';

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
      const roomId = req.params.roomId;

      const userId = req.user.id;

      const data = await this._getPrivateNoteUseCase.execute(roomId!, userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleSavePrivateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, roomId } = req.body;

      const userId = req.user.id;

      const data = await this._savePrivateNoteUseCase.execute(userId, roomId, content);

      res.status(HttpStatus.Created).json(data);
    } catch (error) {
      next(error);
    }
  }

}