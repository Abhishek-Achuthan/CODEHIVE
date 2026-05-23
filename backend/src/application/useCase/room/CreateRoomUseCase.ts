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
import { LimitKey } from '../../../domain/types/LimitKey';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { EntitlementResolutionService } from '../../services/EntitlementsResolutionService';
import { RoomFeatureSnapshotFactory } from '../../services/RoomFeatureSnapshotFactory';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

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
  ) { }

  async execute(data: CreateRoomDTO): Promise<CreateRoomResponseDTO> {
    const entitlements = await this._entitlementResolutionService.resolve(data.userId);
    const featureSnapshot = this._roomFeatureSnapshotFactory.create(entitlements);

    const activeRoomsCount = await this._roomRepository.countActiveRoomsByHostId(data.userId);
    const maxActiveRooms = entitlements.limits[LimitKey.MAX_ACTIVE_ROOMS] ?? 3;

    if (activeRoomsCount >= maxActiveRooms) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACTIVE_ROOM_LIMIT_REACHED);
    }

    const maxParticipants = entitlements.limits[LimitKey.MAX_PARTICIPANTS] ?? 10;

    const room = await this._roomRepository.create({
      title: data.title,
      hostId: data.userId,
      visibility: data.visibility,
      type: RoomType.CUSTOM,
      participantCount: 1,
      maxParticipants,
      featureSnapshot,
      lifecycleStatus: RoomLifeCycleStatus.ACTIVE,
      admissionPolicy: RoomAdmissionPolicy.REQUEST_TO_JOIN,
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

      return room;
    } catch (error) {
      await this._roomRepository.delete(room.id);
      throw error;
    }
  }
}
