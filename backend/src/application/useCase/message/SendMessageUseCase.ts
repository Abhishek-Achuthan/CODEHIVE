import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';

import { MessageEntity } from '../../../domain/entities/room/MessageEntity';
import { ISendMessageUseCase } from '../interface/message/ISendMessageUseCase';
import { SendMessageDTO, SendMessageResponseDTO } from '../../dto/MessageDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,

    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: SendMessageDTO): Promise<SendMessageResponseDTO> {
    const authorizationContext = await this.roomAuthorizationService.assertCapability(
      data.roomId,
      data.senderId,
      CapabilityKey.ROOM_CHAT_WRITE,
    );

    if (!data.content || data.content.trim().length === 0) {
      throw new Error(ERROR_MESSAGES.ROOM.MESSAGE_EMPTY);
    }

    const message: Omit<MessageEntity, 'createdAt' | 'updatedAt'> = {
      id: '',
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content.trim(),
    };

    if (data.parentMessageId) {
      message.parentMessageId = data.parentMessageId;
    }

    const created = await this.messageRepository.create(message);

    const sender = await this.userRepository.find(data.senderId);

    const response: SendMessageResponseDTO = {
      id: created.id,
      roomId: authorizationContext.room.id,
      senderId: created.senderId,
      senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown User',
      content: created.content,
      createdAt: created.createdAt,
    };

    if (sender?.avatarUrl) {
      response.avatarUrl = sender.avatarUrl;
    }

    if (created.parentMessageId) {
      response.parentMessageId = created.parentMessageId;
    }

    return response;

  }
}
