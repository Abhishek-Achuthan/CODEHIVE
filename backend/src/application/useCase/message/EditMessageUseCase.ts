import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import { IEditMessageUseCase, EditMessageDTO } from '../interface/message/IEditMessageUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class EditMessageUseCase implements IEditMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(data: EditMessageDTO): Promise<void> {
    const message = await this.messageRepository.find(data.messageId);

    if (!message) {
      throw new Error(ERROR_MESSAGES.ROOM.MESSAGE_NOT_FOUND);
    }

    if (message.senderId !== data.senderId) {
      throw new Error(ERROR_MESSAGES.ROOM.NOT_ALLOWED_TO_EDIT_MESSAGE);
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error(ERROR_MESSAGES.ROOM.MESSAGE_EMPTY);
    }

    await this.messageRepository.update(data.messageId, { content: data.content.trim() });
  }
}
