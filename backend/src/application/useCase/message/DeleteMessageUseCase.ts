import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import {
  IDeleteMessageUseCase,
} from '../interface/message/IDeleteMessageUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';
import { DeleteMessageDTO, DeleteMessageResultDTO } from '../../dto/MessageDTO';

@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,

    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: DeleteMessageDTO): Promise<DeleteMessageResultDTO> {
    const message = await this.messageRepository.find(data.messageId);

    if (!message) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.MESSAGE_NOT_FOUND);
    }

    if (message.senderId === data.userId) {
      await this.roomAuthorizationService.assertCapability(
        message.roomId,
        data.userId,
        CapabilityKey.ROOM_CHAT_DELETE_OWN,
      );
    } else {
      await this.roomAuthorizationService.assertCapability(
        message.roomId,
        data.userId,
        CapabilityKey.ROOM_PARTICIPANT_KICK,
      );
    }

    await this.messageRepository.delete(data.messageId);

    return {
      roomId: message.roomId,
      messageId: data.messageId,
    };
  }
}
