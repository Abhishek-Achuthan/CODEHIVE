import { inject, injectable } from 'tsyringe';
import { IEndRoomUseCase } from '../interface/room/IEndRoomUseCase';
import { EndRoomDTO } from '../../dto/RoomDTO';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomEventEmitter } from '../../ports/realtime/IRoomEventEmitter';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { RoomLifecycleTransitionService } from '../../../domain/services/RoomLifecycleTransitionService';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import { RoomType } from '../../../domain/types/RoomType';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class EndRoomUseCase implements IEndRoomUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject(RoomLifecycleTransitionService)
    private readonly _lifecycleTransitionService: RoomLifecycleTransitionService,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
  ) {}

  async execute(data: EndRoomDTO): Promise<void> {
    const room = await this._roomAuthorizationService.assertHost(
      data.roomId,
      data.hostUserId,
    );

    if (room.type !== RoomType.CUSTOM) {
      throw new ForbiddenError(ERROR_MESSAGES.ROOM.ONLY_CUSTOM_ROOMS_CAN_BE_ENDED);
    }

    const result = this._lifecycleTransitionService.resolveTransition(
      room,
      RoomLifecycleTransition.END,
    );

    if (!result) {
      throw new BadRequestError(ERROR_MESSAGES.ROOM.CANNOT_END_ROOM);
    }

    const updated = await this._roomRepository.update(data.roomId, result.updates);

    if (!updated) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    this._roomEventEmitter.emitLifecycleChanged(data.roomId, result.nextStatus);
  }
}
