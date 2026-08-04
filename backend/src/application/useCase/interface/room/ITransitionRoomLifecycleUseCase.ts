import { RoomLifecycleTransition } from '../../../../domain/types/RoomLifecycleTransition';

export interface ITransitionRoomLifecycleUseCase {
  execute(roomId: string, transition: RoomLifecycleTransition): Promise<void>;
}
