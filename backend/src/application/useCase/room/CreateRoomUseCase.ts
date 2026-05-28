import { inject, injectable } from 'tsyringe';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { ICreateRoomUseCase } from '../interface/room/ICreateRoomUseCase';
import { CreateRoomDTO, CreateRoomResponseDTO } from '../../dto/RoomDTO';
import { ParticipantEntity } from '../../../domain/entities/room/ParticipantEntity';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { RoomAdmissionPolicy } from '../../../domain/types/RoomAdmissionPolicy';
import { RoomType } from '../../../domain/types/RoomType';
import { RoomRole } from '../../../domain/types/RoomRole';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { LimitKey } from '../../../domain/types/LimitKey';
import { FeatureKey } from '../../../domain/types/FeatureKey';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { EntitlementResolutionService } from '../../services/EntitlementsResolutionService';
import { RoomFeatureSnapshotFactory } from '../../services/RoomFeatureSnapshotFactory';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { RoomInviteService } from '../../services/RoomInviteService';

@injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  constructor(
    @inject('IRoomRepository') private readonly _roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
    @inject(EntitlementResolutionService)
    private readonly _entitlementResolutionService: EntitlementResolutionService,
    @inject(RoomFeatureSnapshotFactory)
    private readonly _roomFeatureSnapshotFactory: RoomFeatureSnapshotFactory,
    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,
  ) {}

  async execute(data: CreateRoomDTO): Promise<CreateRoomResponseDTO> {
    const entitlements = await this._entitlementResolutionService.resolve(data.userId);
    const featureSnapshot = this._roomFeatureSnapshotFactory.create(entitlements);


    if (
      data.visibility === RoomVisibility.PRIVATE &&
      !entitlements.features.includes(FeatureKey.PRIVATE_ROOMS)
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.PRIVATE_ROOM_NOT_ALLOWED);
    }

    const activeRoomsCount = await this._roomRepository.countActiveRoomsByHostId(data.userId);
    const maxActiveRooms = entitlements.limits[LimitKey.MAX_ACTIVE_ROOMS] ?? 3;

    if (activeRoomsCount >= maxActiveRooms) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACTIVE_ROOM_LIMIT_REACHED);
    }

    const maxParticipants = entitlements.limits[LimitKey.MAX_PARTICIPANTS] ?? 10;

    const isPrivate = data.visibility === RoomVisibility.PRIVATE;
    const admissionPolicy = isPrivate
      ? RoomAdmissionPolicy.INVITE_ONLY
      : RoomAdmissionPolicy.REQUEST_TO_JOIN;

    const room = await this._roomRepository.create({
      title: data.title,
      hostId: data.userId,
      visibility: data.visibility,
      type: RoomType.CUSTOM,
      participantCount: 1,
      maxParticipants,
      featureSnapshot,
      lifecycleStatus: RoomLifeCycleStatus.ACTIVE,
      admissionPolicy,
      ...(data.description && { description: data.description }),
    });

    try {
      const participant: ParticipantEntity = {
        id: '',
        roomId: room.id,
        userId: data.userId,
        role: RoomRole.HOST,
        overrides: {},
        joinedAt: new Date(),
      };

      await this._participantRepository.create(participant);

      if (isPrivate) {
        const { joinUrl } = await this._roomInviteService.createHostInvite(
          room.id,
          data.userId,
        );
        return { ...room, joinUrl };
      }

      return room;
    } catch (error) {
      //TODO: need to replace this with the transaction
      await this._roomRepository.delete(room.id);
      throw error;
    }
  }
}
