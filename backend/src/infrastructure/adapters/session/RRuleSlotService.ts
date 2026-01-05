import { RRule, rrulestr } from 'rrule';
import { IRRuleSlotService } from '../../../application/ports/slot/IRRuleSlotService';
import { MentorAvailablityEntity } from '../../../domain/session/MentorAvailablityEntity';
import { DerivedSlot } from '../../../domain/types/DerivedSlot';

export class RRuleSlotService implements IRRuleSlotService {
  generateSlots(
    availabilities: MentorAvailablityEntity[],
    from: Date,
    to: Date
  ): DerivedSlot[] {
    const slots: DerivedSlot[] = [];

    for (const availability of availabilities) {
      if (!availability.isActive) continue;

      const rule = rrulestr(availability.rrule) as RRule;
      const dates = rule.between(from, to, true);

      for (const date of dates) {
        slots.push(...this.generateSlotsForDate(availability, date));
      }
    }
 
    return slots;
  }

  private generateSlotsForDate(
    availability: MentorAvailablityEntity,
    date: Date
  ): DerivedSlot[] {
    const slots: DerivedSlot[] = [];

    const [startHour, startMinute] = availability.startTime
      .split(':')
      .map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);

    const current = new Date(date);
    current.setHours(startHour!, startMinute ?? 0, 0, 0);

    const end = new Date(date);
    end.setHours(endHour!, endMinute, 0, 0);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current);

      slotEnd.setMinutes(
        slotEnd.getMinutes() + availability.slotDurationMinutes
      );

      if (slotEnd > end) break;

      slots.push({
        mentorId: availability.mentorId,
        availabilityId: availability.id,
        date: slotStart.toISOString().split('T')[0]!,
        startTime: this.formatTime(slotStart),
        endTime: this.formatTime(slotEnd),
      });

      current.setMinutes(
        current.getMinutes() +
          availability.slotDurationMinutes +
          availability.bufferMinutes
      );
    }

    return slots;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
}
