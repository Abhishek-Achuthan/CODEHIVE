import { inject, injectable } from 'tsyringe';
import {
  IUpdateRoomDetailsUseCase,
  UpdateRoomDetailsParams,
} from '../interface/room/IUpdateRoomDetailsUseCase';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { RoomEntity } from '../../../domain/entities/room/RoomEntity';
import { RoomVisibility } from '../../../domain/types/RoomVisibility';
import { RoomAdmissionPolicy } from '../../../domain/types/RoomAdmissionPolicy';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';

@injectable()
export class UpdateRoomDetailsUseCase implements IUpdateRoomDetailsUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
  ) {}

  async execute(params: UpdateRoomDetailsParams): Promise<RoomEntity> {
    const { roomId, hostUserId, title, description, visibility } = params;

    const room = await this._roomRepository.find(roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    if (room.hostId !== hostUserId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
    }

    if (
      room.lifecycleStatus === RoomLifeCycleStatus.READONLY ||
      room.lifecycleStatus === RoomLifeCycleStatus.ARCHIVED ||
      room.lifecycleStatus === RoomLifeCycleStatus.PURGED
    ) {
      throw new BadRequestError('Cannot edit details of a read-only or ended room.');
    }

    const updates: Partial<RoomEntity> = {};
    if (title !== undefined) {
      if (!title.trim()) {
        throw new BadRequestError(ERROR_MESSAGES.ROOM.TITLE_REQUIRED);
      }
      if (title.trim().length > 40) {
        throw new BadRequestError(ERROR_MESSAGES.ROOM.TITLE_TOO_LONG);
      }
      updates.title = title.trim();
    }
    if (description !== undefined) updates.description = description;
    if (visibility !== undefined) {
      updates.visibility = visibility;
      if (visibility === RoomVisibility.PRIVATE) {
        updates.admissionPolicy = RoomAdmissionPolicy.INVITE_ONLY;
      } else if (
        visibility === RoomVisibility.PUBLIC_REQUEST &&
        room.admissionPolicy === RoomAdmissionPolicy.INVITE_ONLY
      ) {
        updates.admissionPolicy = RoomAdmissionPolicy.REQUEST_TO_JOIN;
      }
    }

    const updatedRoom = await this._roomRepository.update(roomId, updates);
    if (!updatedRoom) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    return updatedRoom;
  }
}
