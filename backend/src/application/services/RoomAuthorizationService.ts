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
import type { ILoggerService } from '../ports/logging/ILoggerService';

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
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
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
    liftBan?: boolean;
  }> {
    const room = await this._getRoom(roomId);

    let validatedInvite: RoomInviteEntity | undefined;
    const requiresInvite =
      room.visibility === RoomVisibility.PRIVATE ||
      room.admissionPolicy === RoomAdmissionPolicy.INVITE_ONLY ||
      room.admissionPolicy === RoomAdmissionPolicy.BOOKING_ONLY;

    if (options?.inviteCode) {
      validatedInvite = await this._roomInviteService.validateInviteCode(
        options.inviteCode,
        roomId,
      );
    } else if (requiresInvite) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_REQUIRED);
    }

    let liftBan = false;
    const ban = await this._roomBanRepository.findByRoomAndUser(roomId, userId);
    if (ban) {
      if (validatedInvite && validatedInvite.createdAt > ban.bannedAt) {
        liftBan = true;
      } else {
        throw new ForbiddenError(ERROR_MESSAGES.ROOM.REMOVED_FROM_ROOM);
      }
    }

    const existingParticipant = await this._getParticipant(room, userId);
    if (existingParticipant) {
      return {
        room,
        existingParticipant,
        shouldCreateParticipant: false,
        ...(validatedInvite && { validatedInvite }),
        ...(liftBan && { liftBan }),
      };
    }

    this.assertLifecycleAccess(room, 'join');

    if (room.admissionPolicy === RoomAdmissionPolicy.CLOSED) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }

    return {
      room,
      existingParticipant: null,
      shouldCreateParticipant: true,
      ...(validatedInvite && { validatedInvite }),
      ...(liftBan && { liftBan }),
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

  /**
   * Returns whether the user may mutate a collaboration document.
   * Used to set Hocuspocus connection readOnly at authenticate time.
   */
  async isCollaborationWriteAllowed(
    userId: string,
    documentName: string,
  ): Promise<boolean> {
    const writeCapability = this._resolveWriteCapability(documentName);
    if (!writeCapability) {
      return true;
    }

    const roomId = this._parseCollaborationRoomId(documentName);

    try {
      const room = await this._getRoom(roomId);
      this.assertLifecycleAccess(room, 'collaboration');

      const participant = await this._getParticipant(room, userId);
      if (!participant) {
        return false;
      }

      const overrideValue = participant.overrides[writeCapability];
      const result = this._permissionService.canPerform(
        participant,
        room.featureSnapshot,
        writeCapability,
      );

      this._logger.info('Collaboration write access check', {
        documentName,
        roomId,
        userId,
        writeCapability,
        participantRole: participant.role,
        storedOverrides: participant.overrides,
        overrideValue,
        result,
      });

      return result;
    } catch {
      return false;
    }
  }

  async assertCollaborationWriteAccess(
    userId: string,
    documentName: string,
  ): Promise<void> {
    const allowed = await this.isCollaborationWriteAllowed(userId, documentName);
    if (!allowed) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
    }
  }

  assertLifecycleAccess(room: RoomEntity, accessMode: RoomAccessMode): void {
    switch (room.lifecycleStatus) {
      case RoomLifeCycleStatus.ACTIVE:
        return;
      case RoomLifeCycleStatus.SCHEDULED:
      case RoomLifeCycleStatus.READONLY:
      case RoomLifeCycleStatus.ARCHIVED:
        if (accessMode === 'read') {
          return;
        }
        throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
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

  private _parseCollaborationRoomId(documentName: string): string {
    if (documentName.includes(':')) {
      const [type, resourceId] = documentName.split(':');
      if (type === 'room' && resourceId) {
        return resourceId;
      }
    }

    const whiteboardMatch = /^room-([^-]+)-whiteboard$/.exec(documentName);
    if (whiteboardMatch?.[1]) {
      return whiteboardMatch[1];
    }

    const publicNoteMatch = /^room-([^-]+)-public-note$/.exec(documentName);
    if (publicNoteMatch?.[1]) {
      return publicNoteMatch[1];
    }

    throw new ForbiddenError(ERROR_MESSAGES.COLLABORATION.INVALID_DOCUMENT_NAME);
  }

  private _parseCollaborationTarget(documentName: string): CollaborationTarget {
    const roomId = this._parseCollaborationRoomId(documentName);

    if (documentName.includes(':')) {
      return {
        roomId,
        capability: CapabilityKey.ROOM_CODE_EDIT,
      };
    }

    if (/^room-[^-]+-whiteboard$/.test(documentName)) {
      return {
        roomId,
        // Connection gate: view capability — write is enforced via connection readOnly.
        capability: CapabilityKey.ROOM_WHITEBOARD_VIEW,
      };
    }

    if (/^room-[^-]+-public-note$/.test(documentName)) {
      return {
        roomId,
        capability: CapabilityKey.ROOM_PUBLIC_NOTES_VIEW,
      };
    }

    throw new ForbiddenError(ERROR_MESSAGES.COLLABORATION.INVALID_DOCUMENT_NAME);
  }

  /**
   * Resolves the write-level capability for a collaboration document.
   * Returns null for document types where the connection gate already
   * implies write access (e.g. code editor requires ROOM_CODE_EDIT to connect).
   */
  private _resolveWriteCapability(documentName: string): CapabilityKey | null {
    const whiteboardMatch = /^room-([^-]+)-whiteboard$/.exec(documentName);
    if (whiteboardMatch) return CapabilityKey.ROOM_WHITEBOARD_DRAW;

    const publicNoteMatch = /^room-([^-]+)-public-note$/.exec(documentName);
    if (publicNoteMatch) return CapabilityKey.ROOM_PUBLIC_NOTES_EDIT;

    // Code editor: connection already requires ROOM_CODE_EDIT — no separate write gate.
    return null;
  }
}
