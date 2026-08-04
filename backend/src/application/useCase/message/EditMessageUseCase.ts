import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import {
  IEditMessageUseCase,

} from '../interface/message/IEditMessageUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';
import { EditMessageDTO, EditMessageResultDTO } from '../../dto/MessageDTO';

@injectable()
export class EditMessageUseCase implements IEditMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,

    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: EditMessageDTO): Promise<EditMessageResultDTO> {
    const message = await this.messageRepository.find(data.messageId);

    if (!message) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.MESSAGE_NOT_FOUND);
    }

    if (message.senderId !== data.senderId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.NOT_ALLOWED_TO_EDIT_MESSAGE);
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error(ERROR_MESSAGES.ROOM.MESSAGE_EMPTY);
    }

    await this.roomAuthorizationService.assertCapability(
      message.roomId,
      data.senderId,
      CapabilityKey.ROOM_CHAT_WRITE,
    );

    await this.messageRepository.update(data.messageId, { content: data.content.trim() });

    return {
      roomId: message.roomId,
      messageId: data.messageId,
      content: data.content.trim(),
    };
  }
}
