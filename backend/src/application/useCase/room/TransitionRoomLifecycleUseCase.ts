import { inject, injectable } from 'tsyringe';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomEventEmitter } from '../../ports/realtime/IRoomEventEmitter';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { ITransitionRoomLifecycleUseCase } from '../interface/room/ITransitionRoomLifecycleUseCase';

@injectable()
export class TransitionRoomLifecycleUseCase implements ITransitionRoomLifecycleUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
  ) {}

  async execute(roomId: string, transition: RoomLifecycleTransition): Promise<void> {
    const room = await this._roomRepository.find(roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const now = new Date();
    let nextStatus: RoomLifeCycleStatus | null = null;
    const update: Partial<typeof room> = {};

    switch (transition) {
      case RoomLifecycleTransition.START:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.SCHEDULED) return;
        nextStatus = RoomLifeCycleStatus.ACTIVE;
        break;
      case RoomLifecycleTransition.END:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.ACTIVE) return;
        nextStatus = RoomLifeCycleStatus.READONLY;
        update.readonlyAt = now;
        break;
      case RoomLifecycleTransition.ARCHIVE:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.READONLY) return;
        nextStatus = RoomLifeCycleStatus.ARCHIVED;
        update.archivedAt = now;
        break;
      default:
        return;
    }

    const updated = await this._roomRepository.update(roomId, {
      ...update,
      lifecycleStatus: nextStatus,
    });

    if (!updated) return;

    this._roomEventEmitter.emitLifecycleChanged(roomId, nextStatus);
  }
}
