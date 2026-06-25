import { injectable } from 'tsyringe';

import { RoomEntity } from '../entities/room/RoomEntity';
import { RoomLifeCycleStatus } from '../types/RoomLifeCycleStatus';
import { RoomLifecycleTransition } from '../types/RoomLifecycleTransition';

export interface RoomLifecycleTransitionResult {
  nextStatus: RoomLifeCycleStatus;
  updates: Partial<Pick<RoomEntity, 'readonlyAt' | 'archivedAt' | 'lifecycleStatus'>>;
}

@injectable()
export class RoomLifecycleTransitionService {
  resolveTransition(
    room: Pick<RoomEntity, 'lifecycleStatus'>,
    transition: RoomLifecycleTransition,
    now: Date = new Date(),
  ): RoomLifecycleTransitionResult | null {
    let nextStatus: RoomLifeCycleStatus | null = null;
    const updates: RoomLifecycleTransitionResult['updates'] = {};

    switch (transition) {
      case RoomLifecycleTransition.START:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.SCHEDULED) return null;
        nextStatus = RoomLifeCycleStatus.ACTIVE;
        break;
      case RoomLifecycleTransition.END:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.ACTIVE) return null;
        nextStatus = RoomLifeCycleStatus.READONLY;
        updates.readonlyAt = now;
        break;
      case RoomLifecycleTransition.ARCHIVE:
        if (room.lifecycleStatus !== RoomLifeCycleStatus.READONLY) return null;
        nextStatus = RoomLifeCycleStatus.ARCHIVED;
        updates.archivedAt = now;
        break;
      default:
        return null;
    }

    return {
      nextStatus,
      updates: { ...updates, lifecycleStatus: nextStatus },
    };
  }
}
