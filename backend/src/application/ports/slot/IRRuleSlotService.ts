import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { DerivedSlot } from '../../../domain/types/DerivedSlot';

export interface IRRuleSlotService {
    generateSlots(
        availabilities : MentorAvailabilityEntity[],
        from:Date,
        to:Date
    ):DerivedSlot[]
}