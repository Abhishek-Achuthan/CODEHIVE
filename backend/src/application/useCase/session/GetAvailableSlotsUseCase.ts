import { inject, injectable } from 'tsyringe';
import { IGetAvailableSlotsUseCase } from '../interface/session/IGetAvailableSlotsUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { type IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import { type  ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import { type AvailableSlotDTO } from '../../dto/SessionDTO';
import {  NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';



@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase{
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _availabilityRepo: IMentorAvailabilityRepository,
        @inject('IRRuleSlotService') private readonly _rruleSlotService : IRRuleSlotService,
        @inject('ISessionRepository') private readonly _sessionRepository : ISessionRepository,
        @inject('ISlotConflictService') private readonly _slotConflictService : ISlotConflictService,
    ){}

    async execute(mentorId: string, date: string): Promise<AvailableSlotDTO[]> {
        const availabilities = await this._availabilityRepo.findByMentor(mentorId);
        
        if(availabilities.length ===0) throw new NotFoundError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);

        const from = new Date(date);
        from.setHours(0,0,0,0);

        const to = new Date(date);
        to.setHours(23,59,59,999);

        const derivedSlots = this._rruleSlotService.generateSlots(availabilities,from,to);

        if(derivedSlots.length === 0) return [];

        const sessions = await this._sessionRepository.findByMentorAndDate(mentorId,date);

        const freeSlots = this._slotConflictService.filterBookedSlots(derivedSlots,sessions);

        return freeSlots.map((slot) => ({
            startTime:slot.startTime,
            endTime:slot.endTime,
            price: slot.price,
        }));
    }

}