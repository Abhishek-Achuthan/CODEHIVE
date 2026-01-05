import { SessionEntity } from '../../../domain/session/SessionEntity';
import { DerivedSlot } from '../../../domain/types/DerivedSlot';
import { ISlotConflictService } from '../../../application/ports/slot/ISlotConflictService';

export class SlotConflictService implements ISlotConflictService {
  filterBookedSlots(
    slots: DerivedSlot[],
    sessions: SessionEntity[]
  ): DerivedSlot[] {
    return slots.filter((slot) =>
      !sessions.some((session) =>
        this.isOverlapping(slot, session)
      )
    );
  }

  private isOverlapping(
    slot: DerivedSlot,
    session: SessionEntity
  ): boolean {
    if (slot.date !== session.date) return false;

    const slotStart = this.toMinutes(slot.startTime);
    const slotEnd = this.toMinutes(slot.endTime);

    const sessionStart = this.toMinutes(session.startTime);
    const sessionEnd = this.toMinutes(session.endTime);

    return slotStart < sessionEnd && slotEnd > sessionStart;
  }

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours! * 60 + minutes!;
  }
}
