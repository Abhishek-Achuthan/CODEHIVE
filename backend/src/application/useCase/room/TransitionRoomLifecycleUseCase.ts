import { inject, injectable } from 'tsyringe';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomEventEmitter } from '../../ports/realtime/IRoomEventEmitter';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import { RoomLifecycleTransitionService } from '../../../domain/services/RoomLifecycleTransitionService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { ITransitionRoomLifecycleUseCase } from '../interface/room/ITransitionRoomLifecycleUseCase';

@injectable()
export class TransitionRoomLifecycleUseCase implements ITransitionRoomLifecycleUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject(RoomLifecycleTransitionService)
    private readonly _lifecycleTransitionService: RoomLifecycleTransitionService,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
  ) {}

  async execute(roomId: string, transition: RoomLifecycleTransition): Promise<void> {
    const room = await this._roomRepository.find(roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const result = this._lifecycleTransitionService.resolveTransition(
      room,
      transition,
      new Date(),
    );

    if (!result) return;

    const updated = await this._roomRepository.update(roomId, result.updates);

    if (!updated) return;

    this._roomEventEmitter.emitLifecycleChanged(roomId, result.nextStatus);
  }
}
