import { inject, injectable } from 'tsyringe';
import { IActivateUpcomingSessionUseCase } from '../interface/room/IActivateUpcomingSessionRoomsUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { EntitlementResolutionService } from '../../services/EntitlementsResolutionService';
import { RoomFeatureSnapshotFactory } from '../../services/RoomFeatureSnapshotFactory';
import { RoomType } from '../../../domain/types/RoomType';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { RoomAdmissionPolicy } from '../../../domain/types/RoomAdmissionPolicy';
import { RoomRole } from '../../../domain/types/RoomRole';
import { FeatureKey } from '../../../domain/types/FeatureKey';
import { LimitKey } from '../../../domain/types/LimitKey';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomInviteService } from '../../services/RoomInviteService';
import type { IRoomLifecyclePublisher } from '../../ports/queue/IRoomLifecyclePublisher';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import { env } from '../../../config/envConfig';

const SESSION_ROOM_BASE_PARTICIPANTS = 2;
const SESSION_END_BUFFER_MS = 30 * 60 * 1000;

@injectable()
export class ActivateUpcomingSessionUseCase implements IActivateUpcomingSessionUseCase {
  constructor(
    @inject('ISessionRepository')
    private readonly _sessionRepo: ISessionRepository,

    @inject('IRoomRepository')
    private readonly _roomRepo: IRoomRepository,

    @inject('IParticipantRepository')
    private readonly _participantRepo: IParticipantRepository,

    @inject(EntitlementResolutionService)
    private readonly _entitlementResolutionService: EntitlementResolutionService,

    @inject(RoomFeatureSnapshotFactory)
    private readonly _roomFeatureSnapshotFactory: RoomFeatureSnapshotFactory,

    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,

    @inject('IRoomLifecyclePublisher')
    private readonly _roomLifecyclePublisher: IRoomLifecyclePublisher,
  ) {}

  async execute(sessionId: string): Promise<void> {
    const session = await this._sessionRepo.find(sessionId);

    if (!session)
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);

    if (session.roomId) return;

    const entitlements = await this._entitlementResolutionService.resolve(
      session.mentorId,
    );
    const maxGuests = session.maxGuests ?? 0;
    const desiredCapacity = SESSION_ROOM_BASE_PARTICIPANTS + maxGuests;
    const planMaxParticipants =
      entitlements.limits[LimitKey.MAX_PARTICIPANTS] ??
      SESSION_ROOM_BASE_PARTICIPANTS;
    const maxParticipants = Math.min(desiredCapacity, planMaxParticipants);

    // Mentors get full Pro features unlocked for free in session rooms
    const allFeatures = Object.values(FeatureKey);
    const featureSnapshot = {
      planId: 'session_pro',
      planName: 'Pro Mentor Session',
      enabledFeatures: allFeatures,
      limits: {
        ...entitlements.limits,
        [LimitKey.MAX_PARTICIPANTS]: Math.max(desiredCapacity, planMaxParticipants),
      },
    };

    const room = await this._roomRepo.create({
      title: 'Mentor Session',
      hostId: session.mentorId,
      sessionId: session.id,
      type: RoomType.SESSION,
      visibility: RoomVisibility.PRIVATE,
      lifecycleStatus: RoomLifeCycleStatus.SCHEDULED,
      admissionPolicy: RoomAdmissionPolicy.BOOKING_ONLY,
      featureSnapshot,
      maxParticipants,
      participantCount: SESSION_ROOM_BASE_PARTICIPANTS,
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

    const roomIdPromise = this._sessionRepo.update(session.id, {
      roomId: room.id,
    });

    await Promise.all([hostPromise, participantPromise, roomIdPromise]);

    const expiresAt = new Date(
      session.endTime.getTime() + SESSION_END_BUFFER_MS,
    );

    const { joinUrl } = await this._roomInviteService.createSessionInvite({
      roomId: room.id,
      sessionId: session.id,
      createdBy: session.mentorId,
      expiresAt,
      maxUses: maxParticipants,
    });

    await this._sessionRepo.update(session.id, { joinUrl });

    const now = Date.now();
    const startDelay = Math.max(0, session.startTime.getTime() - now);
    const endDelay = Math.max(0, session.endTime.getTime() - now);
    const archiveDelay = Math.max(
      0,
      session.endTime.getTime() + env.roomArchiveGracePeriodMs - now,
    );

    await Promise.all([
      this._roomLifecyclePublisher.publish(
        room.id,
        RoomLifecycleTransition.START,
        startDelay,
      ),
      this._roomLifecyclePublisher.publish(
        room.id,
        RoomLifecycleTransition.END,
        endDelay,
      ),
      this._roomLifecyclePublisher.publish(
        room.id,
        RoomLifecycleTransition.ARCHIVE,
        archiveDelay,
      ),
    ]);
  }
}
