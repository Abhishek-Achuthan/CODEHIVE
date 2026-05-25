import { inject, injectable } from 'tsyringe';
import { IJoinRoomUseCase } from '../interface/room/IJoinRoomUseCase';
import { JoinRoomDTO, JoinRoomSnapshotDTO } from '../../dto/RoomDTO';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { ParticipantEntity } from '../../../domain/entities/room/ParticipantEntity';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomRole } from '../../../domain/types/RoomRole';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { ConflictError } from '../../../core/errors/ConflictError';

@injectable()
export class JoinRoomUseCase implements IJoinRoomUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly participantRepository: IParticipantRepository,
    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @inject('IPollRepository')
    private readonly pollRepository: IPollRepository,
    @inject(RoomAuthorizationService)
    private readonly roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: JoinRoomDTO): Promise<JoinRoomSnapshotDTO> {
    const joinAuthorization = await this.roomAuthorizationService.assertCanJoinRoom(
      data.roomId,
      data.userId,
    );

    const room = joinAuthorization.room;
    let isNewParticipant = false;

    if (joinAuthorization.shouldCreateParticipant) {

      const updatedRoom = await this.roomRepository.incrementParticipantCount(
        room.id,
        room.maxParticipants,
      );

      if (!updatedRoom) {
        throw new ConflictError(ERROR_MESSAGES.ROOM.ROOM_FULL);
      }

      try {
        const participant: ParticipantEntity = {
          id: '',
          roomId: data.roomId,
          userId: data.userId,
          role: RoomRole.PARTICIPANT,
          overrides: {},
          joinedAt: new Date(),
        };

        await this.participantRepository.create(participant);
        isNewParticipant = true;
      } catch (error: unknown) {
        if (this._isDuplicateKeyError(error)) {
          await this.roomRepository.decrementParticipantCount(room.id);
          isNewParticipant = false;
        } else {
          await this.roomRepository.decrementParticipantCount(room.id);
          throw error;
        }
      }
    }

    const [participants, recentMessages, activePoll] = await Promise.all([
      this.participantRepository.findByRoomIdWithUsers(data.roomId),
      this.messageRepository.findRecentByRoomId(data.roomId, 50),
      this.pollRepository.findActivePollByRoomId(data.roomId),
    ]);

    const messagesWithSenders = await Promise.all(
      recentMessages.map(async (msg) => {
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
          isEdited:
            msg.updatedAt &&
            msg.createdAt &&
            msg.updatedAt.getTime() > msg.createdAt.getTime(),
          ...(msg.parentMessageId && { parentMessageId: msg.parentMessageId }),
          ...(sender?.avatarUrl && { avatarUrl: sender.avatarUrl }),
        };
      }),
    );

    const authorizationContext = await this.roomAuthorizationService.assertParticipant(
      room.id,
      data.userId,
      'read',
    );

    return {
      roomId: room.id,
      isNewParticipant,
      participants: participants.map((p) => ({
        userId: p.userId,
        name: p.name,
        role: p.role,
        ...(p.avatarUrl && { avatarUrl: p.avatarUrl }),
      })),
      messages: messagesWithSenders,
      activePoll,
      capabilities: authorizationContext.capabilities,
      lifecycleStatus: room.lifecycleStatus,
      featureSnapshot: room.featureSnapshot,
    };
  }

  private _isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    );
  }
}
