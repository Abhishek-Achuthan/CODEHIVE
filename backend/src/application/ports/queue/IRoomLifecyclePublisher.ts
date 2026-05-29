import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';

export interface IRoomLifecyclePublisher {
  publish(roomId: string, transition: RoomLifecycleTransition, delayMs: number): Promise<void>;
}
