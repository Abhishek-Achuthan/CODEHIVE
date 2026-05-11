import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { IRoomEventEmitter } from '../../../application/ports/realtime/IRoomEventEmitter';
import type { IDeleteMessageUseCase } from '../../../application/useCase/interface/message/IDeleteMessageUseCase';
import type { IEditMessageUseCase } from '../../../application/useCase/interface/message/IEditMessageUseCase';
import type { ISendMessageUseCase } from '../../../application/useCase/interface/message/ISendMessageUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { HttpStatus } from '../../../shared/httpStatusCode';

@injectable()
export class MessageController {
  constructor(
    @inject('ISendMessageUseCase')
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject('IEditMessageUseCase')
    private readonly _editMessageUseCase: IEditMessageUseCase,
    @inject('IDeleteMessageUseCase')
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
  ) {}

  async handleCreateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const userId = req.user.id;
      const { content, parentMessageId } = req.body as {
        content?: string;
        parentMessageId?: string;
      };

      const message = await this._sendMessageUseCase.execute({
        roomId,
        senderId: userId,
        content: content ?? '',
        ...(parentMessageId && { parentMessageId }),
      });

      this._roomEventEmitter.emitMessageCreated(message.roomId, message);

      res.status(HttpStatus.Created).json(message);
    } catch (error) {
      next(error);
    }
  }

  async handleEditMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const messageId = this.getRequiredParam(req, 'messageId');
      const userId = req.user.id;
      const { content } = req.body as { content?: string };
      const trimmedContent = content?.trim() ?? '';

      await this._editMessageUseCase.execute({
        messageId,
        senderId: userId,
        content: trimmedContent,
      });

      const payload = {
        messageId,
        content: trimmedContent,
      };

      this._roomEventEmitter.emitMessageEdited(roomId, payload);

      res.status(HttpStatus.OK).json(payload);
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = this.getRequiredParam(req, 'roomId');
      const messageId = this.getRequiredParam(req, 'messageId');
      const userId = req.user.id;

      await this._deleteMessageUseCase.execute({
        messageId,
        userId,
      });

      const payload = { messageId };

      this._roomEventEmitter.emitMessageDeleted(roomId, payload);

      res.status(HttpStatus.OK).json(payload);
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
