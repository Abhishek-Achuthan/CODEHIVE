import { createHash, randomBytes } from 'crypto';
import { inject, injectable } from 'tsyringe';
import type { IRoomInviteRepository } from '../../domain/interfaces/IRoomInviteRepository';
import type { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { RoomInviteEntity } from '../../domain/entities/room/RoomInviteEntity';
import { RoomInviteType } from '../../domain/types/RoomInviteType';
import { RoomLifeCycleStatus } from '../../domain/types/RoomLifeCycleStatus';
import { NotFoundError } from '../../core/errors/NotFoundError';
import { ForbiddenError } from '../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export interface CreateInviteResult {
  invite: RoomInviteEntity;
  code: string;
  joinUrl: string;
}

@injectable()
export class RoomInviteService {
  constructor(
    @inject('IRoomInviteRepository')
    private readonly _inviteRepository: IRoomInviteRepository,
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject('frontendUrl')
    private readonly _frontendUrl: string,
    @inject('invitePepper')
    private readonly _invitePepper: string,
  ) {}

  generateCode(): string {
    return randomBytes(9).toString('base64url');
  }

  hashCode(code: string): string {
    return createHash('sha256').update(`${this._invitePepper}:${code}`).digest('hex');
  }

  buildJoinUrl(code: string): string {
    const base = this._frontendUrl.replace(/\/$/, '');
    return `${base}/join/${code}`;
  }

  async createHostInvite(roomId: string, createdBy: string): Promise<CreateInviteResult> {
    await this._inviteRepository.revokeAllActiveForRoom(roomId, RoomInviteType.HOST_MANAGED);

    const code = this.generateCode();
    const invite = await this._inviteRepository.create({
      roomId,
      codeHash: this.hashCode(code),
      createdBy,
      type: RoomInviteType.HOST_MANAGED,
      useCount: 0,
    });

    return { invite, code, joinUrl: this.buildJoinUrl(code) };
  }

  async createSessionInvite(params: {
    roomId: string;
    sessionId: string;
    createdBy: string;
    expiresAt: Date;
    maxUses?: number;
  }): Promise<CreateInviteResult> {
    await this._inviteRepository.revokeAllActiveForRoom(
      params.roomId,
      RoomInviteType.SESSION_AUTO,
    );

    const code = this.generateCode();
    const invite = await this._inviteRepository.create({
      roomId: params.roomId,
      codeHash: this.hashCode(code),
      createdBy: params.createdBy,
      type: RoomInviteType.SESSION_AUTO,
      sessionId: params.sessionId,
      expiresAt: params.expiresAt,
      ...(params.maxUses !== undefined ? { maxUses: params.maxUses } : {}),
      useCount: 0,
    });

    return { invite, code, joinUrl: this.buildJoinUrl(code) };
  }

  async validateInviteCode(code: string, expectedRoomId?: string): Promise<RoomInviteEntity> {
    const invite = await this._inviteRepository.findByCodeHash(this.hashCode(code));

    if (!invite || invite.revokedAt) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.INVITE_INVALID);
    }

    if (expectedRoomId !== undefined && invite.roomId !== expectedRoomId) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_INVALID);
    }

    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_EXPIRED);
    }

    if (invite.maxUses !== undefined && invite.useCount >= invite.maxUses) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_MAX_USES_REACHED);
    }

    const room = await this._roomRepository.find(invite.roomId);

    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    if (
      room.lifecycleStatus === RoomLifeCycleStatus.ARCHIVED ||
      room.lifecycleStatus === RoomLifeCycleStatus.PURGED
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.INVITE_EXPIRED);
    }

    return invite;
  }

  async revokeAllForRoom(roomId: string): Promise<void> {
    await this._inviteRepository.revokeAllActiveForRoom(roomId);
  }

  async recordInviteUse(inviteId: string): Promise<void> {
    await this._inviteRepository.incrementUseCount(inviteId);
  }
}
