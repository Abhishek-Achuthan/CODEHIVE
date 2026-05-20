import { inject, injectable } from "tsyringe";
import { IActivateUpcomingSessionUseCase } from "../interface/room/IActivateUpcomingSessionRoomsUseCase";
import type { ISessionRepository } from "../../../domain/interfaces/ISessionReposiotry";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import type { IParticipantRepository } from "../../../domain/interfaces/IParticipantRepository";
import { RoomType } from "../../../domain/types/RoomType";
import { RoomVisibility } from "../../../domain/types/RoomVisibility";
import { RoomLifeCycleStatus } from "../../../domain/types/RoomLifeCycleStatus";
import { RoomAdmissionPolicy } from "../../../domain/types/RoomAdmissionPolicy";
import { RoomRole } from "../../../domain/types/RoomRole";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class ActivateUpcomingSessionUseCase implements IActivateUpcomingSessionUseCase {
  constructor(
    @inject('ISessionRepository') private readonly _sessionRepo: ISessionRepository,
    @inject('IRoomRepository') private readonly _roomRepo: IRoomRepository,
    @inject('IParticipantRepository') private readonly _participantRepo: IParticipantRepository,
  ) { }

  async execute(sessionId: string): Promise<void> {
    const session = await this._sessionRepo.find(sessionId);

    if (!session) throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);

    if (session.roomId) return;

    const room = await this._roomRepo.create({
      title: "Mentor Session",
      hostId: session.mentorId,
      sessionId: session.id,
      type: RoomType.SESSION,
      visibility: RoomVisibility.PRIVATE,
      lifecycleStatus: RoomLifeCycleStatus.ACTIVE,
      admissionPolicy: RoomAdmissionPolicy.BOOKING_ONLY,
    });

    const hostPromise = this._participantRepo.create({
      roomId: room.id,
      userId: session.mentorId,
      role: RoomRole.HOST,
    });

    const participantPromise = this._participantRepo.create({
      roomId: room.id,
      userId: session.userId,
      role: RoomRole.PARTICIPANT,
    });

    const roomIdPromise = this._sessionRepo.update(session.id, { roomId: room.id });

    await Promise.all([hostPromise, participantPromise, roomIdPromise]);    
  }
}
