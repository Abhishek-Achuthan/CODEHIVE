import { inject, injectable } from 'tsyringe';

import type { IParticipantRepository } from '../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import type { IRoomBanRepository } from '../../domain/interfaces/IRoomBanRepository';
import { RoomInviteEntity } from '../../domain/entities/room/RoomInviteEntity';
import { RoomInviteService } from './RoomInviteService';
import { PermissionService } from '../../domain/services/PermissionService';
import type { ParticipantEntity } from '../../domain/entities/room/ParticipantEntity';
import type { RoomEntity } from '../../domain/entities/room/RoomEntity';
import { RoomLifeCycleStatus } from '../../domain/types/RoomLifeCycleStatus';
import { RoomRole } from '../../domain/types/RoomRole';
import { RoomVisibility } from '../../domain/types/RoomVisibility';
import { RoomAdmissionPolicy } from '../../domain/types/RoomAdmissionPolicy';
import { CapabilityKey } from '../../domain/types/CapabilityKey';
import { FeatureKey } from '../../domain/types/FeatureKey';
import { NotFoundError } from '../../core/errors/NotFoundError';
import { ForbiddenError } from '../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export type RoomAccessMode = 'read' | 'write' | 'join' | 'collaboration';

export interface RoomAuthorizationContext {
  room: RoomEntity;
  participant: ParticipantEntity;
  capabilities: Partial<Record<CapabilityKey, boolean>>;
}

interface CollaborationTarget {
  roomId: string;
  capability: CapabilityKey;
}

@injectable()
export class RoomAuthorizationService {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
    @inject('IRoomBanRepository')
    private readonly _roomBanRepository: IRoomBanRepository,
    @inject(RoomInviteService)
    private readonly _roomInviteService: RoomInviteService,
    @inject(PermissionService)
    private readonly _permissionService: PermissionService,
  ) {}

  async assertRoomAccess(
    roomId: string,
    userId: string,
    accessMode: RoomAccessMode = 'read',
  ): Promise<RoomAuthorizationContext> {
    return this.assertParticipant(roomId, userId, accessMode);
  }

  async assertParticipant(
    roomId: string,
    userId: string,
    accessMode: RoomAccessMode = 'read',
  ): Promise<RoomAuthorizationContext> {
    const room = await this._getRoom(roomId);
    this.assertLifecycleAccess(room, accessMode);

    const participant = await this._getParticipant(room, userId);

    if (!participant) throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);

    return this._buildContext(room, participant);
  }

  async assertCapability(
    roomId: string,
    userId: string,
    capability: CapabilityKey,
    accessMode: RoomAccessMode = 'write',
  ): Promise<RoomAuthorizationContext> {
    const context = await this.assertParticipant(roomId, userId, accessMode);

    if (!this._permissionService.canPerform(context.participant, context.room.featureSnapshot, capability))
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);

    return context;
  }

  async assertAnyCapability(
    roomId: string,
    userId: string,
    capabilities: CapabilityKey[],
    accessMode: RoomAccessMode = 'read',
  ): Promise<RoomAuthorizationContext> {
    const context = await this.assertParticipant(roomId, userId, accessMode);
    const allowed = capabilities.some((capability) =>
      this._permissionService.canPerform(context.participant, context.room.featureSnapshot, capability),
    );

    if (!allowed) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }

    return context;
  }

  async assertFeatureEnabled(
    roomId: string,
    userId: string,
    feature: FeatureKey,
    accessMode: RoomAccessMode = 'read',
  ): Promise<RoomAuthorizationContext> {
    const context = await this.assertParticipant(roomId, userId, accessMode);
    this._assertFeatureEnabledForRoom(context.room, feature);
    return context;
  }

  async assertCanJoinRoom(
    roomId: string,
    userId: string,
    options?: { inviteCode?: string },
  ): Promise<{
    room: RoomEntity;
    existingParticipant: ParticipantEntity | null;
    shouldCreateParticipant: boolean;
    validatedInvite?: RoomInviteEntity;
  }> {
    const room = await this._getRoom(roomId);
    this.assertLifecycleAccess(room, 'join');

    if (await this._roomBanRepository.exists(roomId, userId)) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.REMOVED_FROM_ROOM);
    }

    const existingParticipant = await this._getParticipant(room, userId);
    if (existingParticipant) {
      return { room, existingParticipant, shouldCreateParticipant: false };
    }

    const requiresInvite =
      room.visibility === RoomVisibility.PRIVATE ||
      room.admissionPolicy === RoomAdmissionPolicy.INVITE_ONLY ||
      room.admissionPolicy === RoomAdmissionPolicy.BOOKING_ONLY;

    if (room.admissionPolicy === RoomAdmissionPolicy.CLOSED) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }

    if (requiresInvite) {
      if (!options?.inviteCode) {
        throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_REQUIRED);
      }

      const validatedInvite = await this._roomInviteService.validateInviteCode(
        options.inviteCode,
        roomId,
      );

      return {
        room,
        existingParticipant: null,
        shouldCreateParticipant: true,
        validatedInvite,
      };
    }

    return {
      room,
      existingParticipant: null,
      shouldCreateParticipant: true,
    };
  }

  async assertHost(roomId: string, userId: string): Promise<RoomEntity> {
    const room = await this._getRoom(roomId);

    if (room.hostId !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ONLY_HOST_CAN_MANAGE_INVITES);
    }

    return room;
  }

  async assertCollaborationAccess(
    userId: string,
    documentName: string,
  ): Promise<RoomAuthorizationContext> {
    const target = this._parseCollaborationTarget(documentName);
    return this.assertCapability(
      target.roomId,
      userId,
      target.capability,
      'collaboration',
    );
  }

  assertLifecycleAccess(room: RoomEntity, accessMode: RoomAccessMode): void {
    switch (room.lifecycleStatus) {
      case RoomLifeCycleStatus.ACTIVE:
        return;
      case RoomLifeCycleStatus.READONLY:
        if (accessMode === 'read') {
          return;
        }
        throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
      case RoomLifeCycleStatus.SCHEDULED:
      case RoomLifeCycleStatus.ARCHIVED:
      case RoomLifeCycleStatus.PURGED:
      default:
        throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }
  }

  private async _getRoom(roomId: string): Promise<RoomEntity> {
    const room = await this._roomRepository.find(roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }
    return room;
  }

  private async _getParticipant(
    room: RoomEntity,
    userId: string,
  ): Promise<ParticipantEntity | null> {
    const participant = await this._participantRepository.findByRoomAndUser(room.id, userId);
    
    if (participant) return participant;
    
    if (room.hostId === userId) {
      return {
        id: `host:${room.id}:${userId}`,
        roomId: room.id,
        userId,
        role: RoomRole.HOST,
        overrides: {},
        joinedAt: room.createdAt,
      };
    }

    return null;
  }

  private _buildContext(
    room: RoomEntity,
    participant: ParticipantEntity,
  ): RoomAuthorizationContext {
    return {
      room,
      participant,
      capabilities: this._permissionService.resolveAll(participant, room.featureSnapshot),
    };
  }

  private _assertFeatureEnabledForRoom(room: RoomEntity, feature: FeatureKey): void {
    const enabledFeatures = room.featureSnapshot?.enabledFeatures;
    if (enabledFeatures && !enabledFeatures.includes(feature)) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }
  }

  private _parseCollaborationTarget(documentName: string): CollaborationTarget {
    if (documentName.includes(':')) {
      const [type, resourceId] = documentName.split(':');
      if (type === 'room' && resourceId) {
        return {
          roomId: resourceId,
          capability: CapabilityKey.ROOM_CODE_EDIT,
        };
      }
    }

    const whiteboardMatch = /^room-([^-]+)-whiteboard$/.exec(documentName);
    if (whiteboardMatch?.[1]) {
      return {
        roomId: whiteboardMatch[1],
        capability: CapabilityKey.ROOM_WHITEBOARD_DRAW,
      };
    }

    const publicNoteMatch = /^room-([^-]+)-public-note$/.exec(documentName);
    if (publicNoteMatch?.[1]) {
      return {
        roomId: publicNoteMatch[1],
        capability: CapabilityKey.ROOM_NOTES_EDIT,
      };
    }

    throw new ForbiddenError(ERROR_MESSAGES.COLLABORATION.INVALID_DOCUMENT_NAME);
  }
}
