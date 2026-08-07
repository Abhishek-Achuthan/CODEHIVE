import { inject, injectable } from 'tsyringe';
import { IEndRoomUseCase } from '../interface/room/IEndRoomUseCase';
import { EndRoomDTO } from '../../dto/RoomDTO';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import type { ITransitionRoomLifecycleUseCase } from '../interface/room/ITransitionRoomLifecycleUseCase';

@injectable()
export class EndRoomUseCase implements IEndRoomUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('ITransitionRoomLifecycleUseCase')
    private readonly _transitionUseCase: ITransitionRoomLifecycleUseCase,
  ) {}

  async execute(data: EndRoomDTO): Promise<void> {
    await this._roomAuthorizationService.assertHost(
      data.roomId,
      data.hostUserId,
    );

    await this._transitionUseCase.execute(data.roomId, RoomLifecycleTransition.END);
  }
}
