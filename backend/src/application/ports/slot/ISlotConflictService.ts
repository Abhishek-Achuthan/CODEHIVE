import { SessionEntity } from '../../../domain/session/SessionEntity';
import { DerivedSlot } from '../../../domain/types/DerivedSlot';

export interface ISlotConflictService {
    filterBookedSlots(slots:DerivedSlot[],sessions:SessionEntity[]): DerivedSlot[]
}