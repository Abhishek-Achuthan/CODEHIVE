import { inject, injectable } from 'tsyringe';

import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';

import { MessageEntity } from '../../../domain/entities/room/MessageEntity';
import { ISendMessageUseCase } from '../interface/message/ISendMessageUseCase';
import { SendMessageDTO, SendMessageResponseDTO } from '../../dto/MessageDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,

    @inject('IParticipantRepository')
    private readonly participantRepository: IParticipantRepository,
  ) {}

  async execute(data: SendMessageDTO): Promise<SendMessageResponseDTO> {
    const participant = await this.participantRepository.findByRoomAndUser(
      data.roomId,
      data.senderId,
    );

    if (!participant) {
      throw new Error(ERROR_MESSAGES.ROOM.USER_NOT_IN_ROOM);
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error(ERROR_MESSAGES.ROOM.MESSAGE_EMPTY);
    }

    const message: Omit<MessageEntity, 'createdAt' | 'updatedAt'> = {
      id: '',
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content.trim(),
    };

    const created = await this.messageRepository.create(message);

    const sender = await this.participantRepository.findByRoomAndUser(data.roomId, data.senderId);

    return {
      id: created.id,
      roomId: created.roomId,
      senderId: created.senderId,
      senderName: sender ? (sender as any).name || 'Unknown User' : 'Unknown User',
      content: created.content,
      createdAt: created.createdAt,
      avatarUrl: (sender as any).avatarUrl,
    };

  }
}
