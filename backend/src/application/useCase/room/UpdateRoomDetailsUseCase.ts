import { inject, injectable } from 'tsyringe';
import { IUpdateRoomDetailsUseCase, UpdateRoomDetailsParams } from '../interface/room/IUpdateRoomDetailsUseCase';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { RoomEntity } from '../../../domain/entities/room/RoomEntity';

@injectable()
export class UpdateRoomDetailsUseCase implements IUpdateRoomDetailsUseCase {
  constructor(
    @inject('IRoomRepository') private readonly _roomRepository: IRoomRepository
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

    const updates: Partial<RoomEntity> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (visibility !== undefined) updates.visibility = visibility;

    const updatedRoom = await this._roomRepository.update(roomId, updates);
    if (!updatedRoom) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    return updatedRoom;
  }
}
