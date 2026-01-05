import { MentorAvailablityEntity } from '../../../domain/session/MentorAvailablityEntity';
import { DerivedSlot } from '../../../domain/types/DerivedSlot';

export interface IRRuleSlotService {
    generateSlots(
        availabilities : MentorAvailablityEntity[],
        from:Date,
        to:Date
    ):DerivedSlot[]
}