import { inject, injectable } from "tsyringe";
import { IJoinRoomUseCase } from "../interface/room/IJoinRoomUseCase";
import { JoinRoomDTO, JoinRoomSnapshotDTO } from "../../dto/RoomDTO";
import type { IParticipantRepository } from "../../../domain/interfaces/IParticipantRepository";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import type { IMessageRepository } from "../../../domain/interfaces/IMessageRepository";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ParticipantEntity } from "../../../domain/entities/room/ParticipantEntity";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class JoinRoomUseCase implements IJoinRoomUseCase {
  constructor(
    @inject("IRoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("IParticipantRepository")
    private readonly participantRepository: IParticipantRepository,
    @inject("IMessageRepository")
    private readonly messageRepository: IMessageRepository,
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}
  async execute(data: JoinRoomDTO): Promise<JoinRoomSnapshotDTO> {
    const room = await this.roomRepository.find(data.roomId);
    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const existing = await this.participantRepository.findByRoomAndUser(
      data.roomId,
      data.userId,
    );
    let isNewParticipant = false;

    try {
      if (!existing) {
        const currentCount = await this.participantRepository.countByRoomId(
          data.roomId,
        );

        if (currentCount >= room.maxParticipants) {
          throw new Error(ERROR_MESSAGES.ROOM.ROOM_FULL);
        }

        const participant: ParticipantEntity = {
          id: "",
          roomId: data.roomId,
          userId: data.userId,
          role: "PARTICIPANT",
          joinedAt: new Date(),
        };

        await this.participantRepository.create(participant);
        isNewParticipant = true;

        await this.roomRepository.update(room.id, {
          participantCount: currentCount + 1,
        });
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        isNewParticipant = false;
      } else {
        throw error;
      }
    }

    const participants = await this.participantRepository.findByRoomIdWithUsers(
      data.roomId,
    );
    const recentMessages = await this.messageRepository.findRecentByRoomId(
      data.roomId,
      50,
    );

    const messagesWithSenders = await Promise.all(
      recentMessages.map(async (msg) => {
        const sender = await this.userRepository.find(msg.senderId);
        return {
          id: msg.id,
          roomId: msg.roomId,
          senderId: msg.senderId,
          senderName: sender
            ? `${sender.firstName} ${sender.lastName}`
            : "Unknown User",
          content: msg.content,
          createdAt: msg.createdAt,
          ...(sender?.avatarUrl && { avatarUrl: sender.avatarUrl }),
        };
      }),
    );

    return {
      roomId: data.roomId,
      isNewParticipant,
      participants: participants.map((p) => ({
        userId: p.userId,
        name: p.name,
        role: p.role,
        ...(p.avatarUrl && { avatarUrl: p.avatarUrl }),
      })),
      messages: messagesWithSenders,
    };
  }
}
