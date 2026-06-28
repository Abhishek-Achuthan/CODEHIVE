import { inject, injectable } from 'tsyringe';
import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { SendMessageResponseDTO } from '../../dto/MessageDTO';

export interface IGetAdminRoomChatHistoryUseCase {
  execute(roomId: string): Promise<SendMessageResponseDTO[]>;
}

@injectable()
export class GetAdminRoomChatHistoryUseCase implements IGetAdminRoomChatHistoryUseCase {
  constructor(
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(roomId: string): Promise<SendMessageResponseDTO[]> {
    const messages = await this.messageRepository.findByRoomId(roomId);

    const messagesWithSenders = await Promise.all(
      messages.map(async (msg) => {
        const sender = await this.userRepository.find(msg.senderId);
        return {
          id: msg.id,
          roomId: msg.roomId,
          senderId: msg.senderId,
          senderName: sender
            ? `${sender.firstName} ${sender.lastName}`
            : 'Unknown User',
          content: msg.content,
          createdAt: msg.createdAt,
          ...(msg.isDeleted !== undefined && { isDeleted: msg.isDeleted }),
          isEdited:
            msg.updatedAt &&
            msg.createdAt &&
            msg.updatedAt.getTime() > msg.createdAt.getTime(),
          ...(msg.parentMessageId && { parentMessageId: msg.parentMessageId }),
          ...(sender?.avatarUrl && { avatarUrl: sender.avatarUrl }),
        };
      }),
    );

    return messagesWithSenders;
  }
}
