import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { IDeleteMessageUseCase, DeleteMessageDTO } from '../interface/message/IDeleteMessageUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';

@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,

    @inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(data: DeleteMessageDTO): Promise<void> {
    const message = await this.messageRepository.find(data.messageId);

    if (!message) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.MESSAGE_NOT_FOUND);
    }

    const room = await this.roomRepository.find(message.roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    if (message.senderId !== data.userId && room.hostId !== data.userId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.NOT_ALLOWED_TO_DELETE_MESSAGE);
    }

    await this.messageRepository.delete(data.messageId);
  }
}
