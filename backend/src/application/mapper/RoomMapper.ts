import { RoomEntity, RoomFeatureSnapshot } from '../../domain/entities/room/RoomEntity';
import { RoomListItemDTO } from '../dto/RoomDTO';
import { ResolvedEntitlements } from '../services/EntitlementsResolutionService';

export class RoomMapper {
  public static toFeatureSnapshot(entitlements: ResolvedEntitlements): RoomFeatureSnapshot {
    return {
      planId: entitlements.plan.id,
      planName: entitlements.plan.name,
      enabledFeatures: [...new Set(entitlements.features)],
      limits: {
        ...entitlements.limits,
      },
    };
  }

  public static toRoomListItem(room: RoomEntity): RoomListItemDTO {
    return {
      id: room.id,
      title: room.title,
      ...(room.description !== undefined ? { description: room.description } : {}),
      visibility: room.visibility,
      hostId: room.hostId,
      ...(room.hostName !== undefined ? { hostName: room.hostName } : {}),
      ...(room.hostAvatarUrl !== undefined ? { hostAvatarUrl: room.hostAvatarUrl } : {}),
      maxParticipants: room.maxParticipants,
      participantCount: room.participantCount,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
