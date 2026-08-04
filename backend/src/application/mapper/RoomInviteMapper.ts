import { RoomInviteEntity } from '../../domain/entities/room/RoomInviteEntity';
import { RoomInviteResponseDTO } from '../dto/RoomDTO';

export class RoomInviteMapper {
  static toResponse(invite: RoomInviteEntity, joinUrl?: string): RoomInviteResponseDTO {
    return {
      id: invite.id,
      roomId: invite.roomId,
      joinUrl: joinUrl ?? '',
      type: invite.type,
      ...(invite.expiresAt !== undefined
        ? { expiresAt: invite.expiresAt.toISOString() }
        : {}),
      ...(invite.maxUses !== undefined ? { maxUses: invite.maxUses } : {}),
      useCount: invite.useCount,
      ...(invite.revokedAt !== undefined
        ? { revokedAt: invite.revokedAt.toISOString() }
        : {}),
      createdAt: invite.createdAt.toISOString(),
    };
  }
}
